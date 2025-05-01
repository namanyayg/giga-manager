# MCP Server Project

## Project Overview
The MCP (Memory and Control Protocol) server is designed to handle project memory and task management for users. It serves as a centralized system for managing project-related information, tasks, and state, providing a robust foundation for project management and automation.

## Core Functionality
- Project Memory Management
  - Persistent storage of project state in `.giga` directory
  - Project documentation management
  - State synchronization through MCP protocol
- Task Management
  - Task execution through MCP protocol
  - Server-side event handling
  - Message routing and processing
- Tool Registration System
  - Centralized prompt management
  - DRY tool registration helpers
  - Standardized prompt-based tool implementation
- PR Automation
  - Automated feature branch creation
  - Standardized PR creation process
  - Git workflow automation

## System Architecture
The MCP server follows a modular architecture with the following components:

1. **Core Server**
   - Express.js server for handling HTTP requests
   - MCP protocol implementation using `@modelcontextprotocol/sdk`
   - Server-Sent Events (SSE) for real-time communication

2. **Memory Module**
   - File-based storage in `.giga` directory
   - Project documentation management
   - File system utilities for state persistence

3. **API Layer**
   - SSE endpoint for real-time communication
   - Message handling endpoint
   - Environment-based configuration

## Technical Stack
- Backend: Node.js/JavaScript
- MCP Protocol: `@modelcontextprotocol/sdk`
- Server: Express.js
- Real-time Communication: Server-Sent Events (SSE)
- Schema Validation: Zod
- Environment Management: dotenv

## Project Structure
```
giga-manager/
├── src/
│   └── index.js        # Main server implementation
├── .giga/              # Project memory storage
│   └── project.md      # Project documentation
├── package.json        # Project dependencies
└── .env                # Environment configuration
```
