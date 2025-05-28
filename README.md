# Giga Manager MCP

Supercharge your AI coding experience with Giga Manager. Features:

### 1. Project Memory
Automatically updates and maintains project memory with high-level project information to ensure AI has the latest context.

### 2. Planning
Generates comprehensive plans for new features, identifying relevant files and asking clarifying questions.

### 3. PR Creation Workflow
Automates the process of pushing feature changes and creating pull requests with proper workflow.

### 4. Pull Request Merge Workflow
Handles the merging of reviewed pull requests into the main branch with proper procedures.

## Project Memory

**Problem**: AI assistants lose context between conversations, leading to repetitive explanations

Giga automatically manages project memory, ensuring the AI always has the latest project context, technical decisions, and preferences.

**Example**: 

You start a new conversation about adding a feature  
→ _AI reads existing project memory_  
→ _AI can immediately help without needing context_  
→ _AI updates the memory with new information_  

## Planning

**Problem**: Starting new features without proper planning leads to wasted time and AI doing out of scope work

Giga generates structured plans that identify relevant files, asks clarifying questions, and outlines implementation steps before coding begins.

**Example**:

You: "giga plan user authentication system"  
→ _AI analyzes current codebase_  
→ _Identifies relevant files (auth routes, user models, middleware)_  
→ _Asks clarifying questions_  
→ _Creates plan_  

## PR Creation Workflow

**Problem**: Automate the time consuming process of creating a pull request

**Example**:

You complete a feature implementation and say "giga push the current feature"  
→ _AI guides through proper commit messages_  
→ _AI creates feature branch with consistent naming_  
→ _AI generates PR with proper description and context_  

## Pull Request Merge Workflow

**Problem**: Automate merging a pull request

**Example**:

Feature PR is ready for merge. You say "giga merge"  
→ _AI automates proper merge procedure_  

## Installation

### Extension Installation (Recommended)

Install the "Giga AI" extension from within Cursor, Windsurf, or any other IDE.

Search for "Giga AI" in the extension marketplace and install it.

https://github.com/user-attachments/assets/063770c4-7621-458e-86cb-12f456437aec

### Manual Installation

1. Identify the path for your MCP JSON file.
2. Install it manually by modifying your MCP JSON file:

```json
{
  "mcpServers": {
    "giga-manager": {
      "command": "npx",
      "args": ["-y", "giga-manager"],
    }
  }
}
```

2. Add this one line to your rules file (`.cursorrules` for Cursor, `.windsurfrules` for Windsurf, etc)

```md
EVERY TIME RUN `giga_autorun` TOOL CALL AS THE FIRST THING. DO THAT BEFORE DOING ANYTHING ELSE. STRICTLY FOLLOW ALL INSTRUCTIONS FROM THE RESULT FIRST!
```

## License

This project is licensed under the AGPL-3.0-only license - see the [LICENSE](LICENSE) file for details.
