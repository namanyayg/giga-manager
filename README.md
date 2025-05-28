# Giga Manager MCP

Supercharge your AI coding experience with Giga Manager.

## Features

### 1. Project Memory
Automatically updates and maintains project memory with high-level project information to ensure AI has the latest context.

### 2. Planning
Generates comprehensive plans for new features, identifying relevant files and asking clarifying questions.

### 3. PR Creation Workflow
Automates the process of pushing feature changes and creating pull requests with proper workflow.

### 4. Pull Request Merge Workflow
Handles the merging of reviewed pull requests into the main branch with proper procedures.

---

## Project Memory

**Problem**: AI assistants lose context between conversations, leading to repetitive explanations

Giga Manager's Memory feature automatically loads and updates project memory at the start of each interaction, ensuring the AI always has the latest project context, technical decisions, and user preferences.

**Example**: 

User starts a new conversation about adding a feature
→ AI reads existing project memory
→ AI understands current project architecture, preferences, and context
→ AI can immediately help without needing project re-explanation
→ AI optionally updates the memory with new information (stored in .giga/memory/memory.md)


## Planning

**Problem**: Starting new features without proper planning leads to wasted time and AI doing out of scope work

Giga Manager's Planning feature generates structured plans that identify relevant files, ask clarifying questions, and outline implementation steps before coding begins.

**Example**:

User: "giga plan user authentication system"
→ AI analyzes current codebase
→ Identifies relevant files (auth routes, user models, middleware)
→ Asks clarifying questions (OAuth providers? Password requirements? Session management?)
→ Outlines implementation steps (database schema, API endpoints, frontend components)

## PR Creation Workflow

**Problem**: Automate the time consuming process of creating a pull request

**Example**:

User completes a feature implementation and says "giga push the current feature"
→ AI guides through proper commit messages
→ AI creates feature branch with consistent naming
→ AI generates PR with proper description and context


## Pull Request Merge Workflow

**Problem**: Automate merging a pull request

**Example**:

Feature PR is ready for merge. User says "giga merge"
→ AI automates proper merge procedure

## Installation

### Extension Installation (Recommended)

Install the "Giga AI" extension from within Cursor, Windsurf, or any other IDE.

Search for "Giga AI" in the extension marketplace and install it.

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
