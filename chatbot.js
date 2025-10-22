import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import readline from 'readline';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

class ClaudeChatbot {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.question = promisify(this.rl.question).bind(this.rl);
    this.conversationHistory = [];
    this.mcpClients = new Map();
    this.availableTools = new Map();
    this.model = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
  }

  async start() {
    console.log('🤖 Claude Chatbot with MCP Support');
    console.log('Type "exit" to quit\n');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY environment variable required');
      process.exit(1);
    }

    await this.loadMcpServers();
    await this.chatLoop();
  }

  async loadMcpServers() {
    try {
      const configPath = path.join(process.cwd(), 'mcp-config.json');
      const configData = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      console.log('📡 Connecting to MCP servers...');
      
      for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
        await this.connectMcpServer(serverName, serverConfig);
      }
      
      console.log(`✅ Connected to ${this.mcpClients.size} server(s), ${this.availableTools.size} tool(s) available\n`);
    } catch (error) {
      console.log('⚠️  No MCP configuration found, continuing without tools\n');
    }
  }

  async connectMcpServer(serverName, config) {
    try {
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: { ...process.env, ...config.env }
      });

      const client = new Client({
        name: `claude-chatbot-${serverName}`,
        version: '1.0.0'
      }, {
        capabilities: { tools: {} }
      });

      await client.connect(transport);
      const toolsResponse = await client.listTools();
      
      this.mcpClients.set(serverName, client);
      
      for (const tool of toolsResponse.tools) {
        this.availableTools.set(tool.name, {
          serverName,
          tool,
          client
        });
      }
    } catch (error) {
      console.log(`⚠️  Failed to connect to ${serverName}: ${error.message}`);
    }
  }

  async chatLoop() {
    while (true) {
      try {
        const userInput = await this.question('You: ');
        
        if (userInput.toLowerCase().trim() === 'exit') {
          console.log('👋 Goodbye!');
          break;
        }

        if (!userInput.trim()) continue;

        this.conversationHistory.push({
          role: 'user',
          content: userInput
        });

        const response = await this.getClaudeResponse();
        console.log('Claude:', response + '\n');
        
        this.conversationHistory.push({
          role: 'assistant',
          content: response
        });

      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    }
    
    await this.cleanup();
    this.rl.close();
  }

  async getClaudeResponse() {
    const tools = this.availableTools.size > 0 ? 
      Array.from(this.availableTools.values()).map(toolInfo => ({
        name: toolInfo.tool.name,
        description: toolInfo.tool.description,
        input_schema: toolInfo.tool.inputSchema
      })) : undefined;

    const messageParams = {
      model: this.model,
      max_tokens: 1000,
      messages: this.conversationHistory
    };

    if (tools && tools.length > 0) {
      messageParams.tools = tools;
    }

    try {
      const message = await this.anthropic.messages.create(messageParams);

      // Handle tool use if present
      if (message.content.some(content => content.type === 'tool_use')) {
        return await this.handleToolUse(message);
      }

      return message.content[0].text;
    } catch (error) {
      if (error.status === 404 && error.message.includes('model:')) {
        throw new Error(`Model '${this.model}' not available. Try setting CLAUDE_MODEL environment variable to a different model.`);
      }
      throw error;
    }
  }

  async handleToolUse(message) {
    let responseText = '';
    const toolResults = [];

    for (const content of message.content) {
      if (content.type === 'text') {
        responseText += content.text;
      } else if (content.type === 'tool_use') {
        console.log(`🛠️  Using tool: ${content.name}`);
        
        try {
          const toolInfo = this.availableTools.get(content.name);
          if (!toolInfo) {
            throw new Error(`Tool ${content.name} not found`);
          }

          const result = await toolInfo.client.callTool({
            name: content.name,
            arguments: content.input
          });

          toolResults.push({
            tool_use_id: content.id,
            content: typeof result.content === 'string' ? result.content : 
                     Array.isArray(result.content) ? result.content.map(c => 
                       typeof c === 'string' ? c : JSON.stringify(c)).join('\n') :
                     JSON.stringify(result.content)
          });

        } catch (error) {
          console.log(`❌ Tool ${content.name} failed: ${error.message}`);
          toolResults.push({
            tool_use_id: content.id,
            content: `Error: ${error.message}`,
            is_error: true
          });
        }
      }
    }

    // Send tool results back to Claude
    if (toolResults.length > 0) {
      this.conversationHistory.push({
        role: 'assistant',
        content: message.content
      });

      this.conversationHistory.push({
        role: 'user',
        content: toolResults.map(result => ({
          type: 'tool_result',
          tool_use_id: result.tool_use_id,
          content: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
          is_error: result.is_error || false
        }))
      });

      const followUpMessage = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: this.conversationHistory
      });

      return responseText + followUpMessage.content[0].text;
    }

    return responseText;
  }

  async cleanup() {
    for (const [serverName, client] of this.mcpClients) {
      try {
        await client.close();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});

// Start the chatbot
const chatbot = new ClaudeChatbot();
chatbot.start().catch(error => {
  console.error('❌ Failed to start chatbot:', error.message);
  process.exit(1);
});