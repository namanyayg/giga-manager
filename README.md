# Giga Project & Task Management MCP

Manage project memory and tasks for your AI projects

## Problem

AI coding tools like Cursor often get lost about the project and forget what the user has asked for.

This leads to frustration, repeated explanations, and broken flow. 

This MCP automatically manages your project and tasks via files:

* `.giga/project.md`: Contains a technical overview of your project's high-level information
* `.giga/memory.md`: Retains a "memory" of all the decisions you have taken on the project.


https://github.com/user-attachments/assets/3aa25ae8-40c5-4188-9987-684c4f3602cc

## Installation

1. Automatically install `giga-mcp` in the client of your choice:

```sh
npx -y install-mcp -i "npx -y giga-mcp" --client cursor # or windsurf, cline, etc
```

* Installation command: `npx -y giga-mcp`
* MCP name: `giga-mcp`

Or, install it manually by modifying your JSON file:

```json
{
  "mcpServers": {
    "giga-mcp": {
      "command": "npx",
      "args": ["-y", "giga-mcp"],
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

* Automated project documentation management
* Project memory tracking and management
* Integration with MCP clients like Cursor, Windsurf, etc

## License

This project is licensed under the AGPL-3.0-only license - see the [LICENSE](LICENSE) file for details.
