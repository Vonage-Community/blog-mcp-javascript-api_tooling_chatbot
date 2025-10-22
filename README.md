# Minimal Claude MCP Chatbot

<img src="https://developer.nexmo.com/images/logos/vbc-logo.svg" height="48px" alt="Vonage" />

A clean, educational implementation of a Claude chatbot with MCP (Model Context Protocol) support.

## What this demonstrates

- **Claude API integration** - Basic chat with conversation history
- **MCP server connection** - Automatic discovery and connection to MCP servers
- **Tool usage** - Claude can automatically use tools from MCP servers
- **Error handling** - Graceful handling of API and tool errors

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your Anthropic API key:
   ```bash
   export ANTHROPIC_API_KEY=your_api_key_here
   ```

3. (Optional) Configure MCP servers in `mcp-config.json`

4. Run the chatbot:
   ```bash
   npm start
   ```

## How it works

1. **Initialization** - Loads MCP configuration and connects to servers
2. **Chat Loop** - Continuously processes user input
3. **Claude Integration** - Sends messages with available tools to Claude
4. **Tool Execution** - When Claude requests tools, executes them via MCP
5. **Response** - Returns Claude's final response to the user

## Code Structure

- `constructor()` - Sets up API client, readline, and tool storage
- `loadMcpServers()` - Reads config and connects to MCP servers
- `chatLoop()` - Main conversation loop
- `getClaudeResponse()` - Sends messages to Claude with tool context
- `handleToolUse()` - Executes tools and sends results back to Claude

## Key Features Removed

- Debug modes and verbose logging
- Model querying and selection commands
- Complex fallback logic
- Extra status commands
- Detailed error reporting

This minimal version focuses on the core MCP integration concepts while remaining easy to understand and modify.