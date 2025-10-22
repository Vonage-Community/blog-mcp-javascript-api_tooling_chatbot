# Getting Involved

Thanks for your interest in the project, we'd love to have you involved! Check out the sections below to find out more about what to do next...

## Opening an Issue

We always welcome issues, if you've seen something that isn't quite right or you have a suggestion for a new feature, please go ahead and open an issue in this project. Include as much information as you have, it really helps.

## Making a Code Change

We're always open to pull requests, but these should be small and clearly described so that we can understand what you're trying to do. Feel free to open an issue first and get some discussion going.

### Before You Start

1. **Check existing issues and PRs** - Make sure someone isn't already working on the same thing
2. **Open an issue first** - For significant changes, discuss your approach before coding
3. **Review the codebase** - Familiarize yourself with the existing code style and patterns

### Setting Up Your Development Environment

1. Fork this repository to your own GitHub account
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/blog-mcp-javascript-api_tooling_chatbot.git
   cd blog-mcp-javascript-api_tooling_chatbot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Your Changes

- **Keep changes focused** - One pull request should address one specific issue or feature
- **Follow existing code style** - Match the formatting and conventions used in the project
- **Test your changes** - Ensure the chatbot still works correctly with your modifications
- **Update documentation** - If you're adding new features, update the README or other docs as needed

### Submitting a Pull Request

When you're ready to submit your changes:

1. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git add .
   git commit -m "Add feature: brief description of what you added"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a pull request** from your fork to this repository's `main` branch

### Pull Request Best Practices

Your pull request should include:

- **Clear title** - Summarize what the PR does in one line
- **Detailed description** - Explain:
  - What changes you made and why
  - How to test the changes
  - Any breaking changes or migration steps
  - Screenshots or examples if relevant
- **Link to related issues** - Use "Fixes #123" or "Closes #123" to auto-link issues
- **Small, focused changes** - Large PRs are harder to review and more likely to have issues

### Example Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Changes Made
- List specific changes
- Include any new files or modified functionality
- Mention any dependencies added/updated

## Testing
- [ ] Tested with basic chatbot functionality
- [ ] Tested with MCP server integration
- [ ] Verified no breaking changes

## Related Issues
Fixes #123

## Additional Notes
Any additional context, concerns, or questions for reviewers.
```

### After Submitting

- **Respond to feedback** - Address reviewer comments promptly and professionally
- **Keep your branch updated** - If the main branch changes, rebase or merge to stay current
- **Be patient** - Reviews take time, especially for volunteer maintainers

## Reviewing a Pull Request

To run the code for an open PR, follow these steps:

1. `git clone git@github.com:Vonage-Community/blog-mcp-javascript-api_tooling_chatbot.git`
1. `cd blog-mcp-javascript-api_tooling_chatbot`
1. `git checkout BRANCH_NAME`
1. `npm install`