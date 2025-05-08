# Giga Project & Task Management MCP

Manage project memory and tasks for your AI projects

## Problem

AI coding tools like Cursor often get lost about the project and forget what the user has asked for.

This leads to frustration, repeated explanations, and broken flow. 

This MCP automatically manages your project and tasks via files:

* `.giga/memory/memory.md`: Contains all project information including technical overview, decisions, preferences, and instructions

https://github.com/user-attachments/assets/3aa25ae8-40c5-4188-9987-684c4f3602cc

## Installation

1. Automatically install `giga-manager` in the client of your choice:

```sh
npx -y install-mcp -i "npx -y giga-manager" --client cursor # or windsurf, cline, etc
```

* Installation command: `npx -y giga-manager`
* MCP name: `giga-manager`

Or, install it manually by modifying your JSON file:

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

https://github.com/user-attachments/assets/d98863a2-a5d4-4fd0-b301-de497fc20cc9


## Features

* Automated project memory management
* Project memory tracking and management
* Integration with MCP clients like Cursor, Windsurf, etc

## Available Tools

-   **`giga_autorun`**: Returns a prompt template for automatically updating project memory with high-level project information. This tool is typically run automatically at the beginning of each interaction to ensure the AI has the latest project context.
-   **`giga_push_feature`**: Returns a prompt template for pushing feature changes and creating a pull request. Use this after you've completed coding a feature and are ready to commit and share it.
-   **`giga_merge_feature`**: Returns a prompt template for merging a pull request. Use this when a feature's pull request has been reviewed and is ready to be merged into the main branch.
-   **`giga_plan`**: Generates a plan for a new feature. Use "giga plan <feature explanation>" to have the AI help you outline the steps, identify relevant files, and ask clarifying questions before you start coding.

## License

This project is licensed under the AGPL-3.0-only license - see the [LICENSE](LICENSE) file for details.
