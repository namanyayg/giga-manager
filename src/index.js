import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const FILEPATHS = {
  PROJECT_DOCUMENTATION: ".giga/project.md",
  PROJECT_MEMORY: ".giga/memory.md",
}

/**
 * @type {Object.<string, string>} PROMPTS - Centralized prompts used throughout the application
 */
const PROMPTS = {
  // Giga autorun prompt
  GIGA_AUTORUN: `You are an expert project manager and help the user in managing their project and tasks.

FOR EVERY PROMPT BY THE USER, ALWAYS FIRST READ ALL PROJECT DOCUMENTATION:

${FILEPATHS.PROJECT_DOCUMENTATION}
${FILEPATHS.PROJECT_MEMORY}

TO HAVE FULL CONTEXT, THEN RESPOND.

Based on the conversation, you might need to update the above files. ALWAYS DO THAT WITH THE LEAST AMOUNT OF TEXT, NO OVERLY DETAILED EXPLANATIONS, NO BUZZWORDS, NO FLUFF.

FOLLOW ALL INSTRUCTIONS BELOW EVERY TIME YOU TALK:

<ProjectDocumentation>
FILE: ${FILEPATHS.PROJECT_DOCUMENTATION}

First, review the project documentation file FULLY. 

If the project file does not exist, ASK THE USER more details about what they want to do and create the file with EXACTLY what they say (don't add useless extra info)

If the user is saying something that contradicts the current documentation, ASK the user, then update the documentation to reflect the new information.

Each and EVERY WORD in the documentation must be accurate, if you think the documentation is wrong, ASK THE USER AND REMOVE IRRELEVANT INFORMATION.

If the conversation contains information relating to a high-level understanding of the project, update the file at ${FILEPATHS.PROJECT_DOCUMENTATION} accordingly. This includes:

- Project architecture and design decisions
- Core functionality and features
- Important technical decisions and their rationale
- Project goals and objectives
- Do not include information about setup, deployment, testing, or other non-project-related information.

While managing this, it is MOST IMPORTANT to not hallucinate or make up information. Write less, but be accurate about what the user has said. Rather than hallucinating information, ASK THE USER FOR MORE INFORMATION if you are unsure.

The documentation serves as a single source of truth for the project's technical understanding.
</ProjectDocumentation>

<ProjectMemory>
FILE: ${FILEPATHS.PROJECT_MEMORY}

This file contains "memory" or instructions that the user wants to follow.

This might include preferences about code style, what technical libraries should and should not be used, and any general instructions about the project.
</ProjectMemory>
`
};

/**
 * @type {Object.<string, string>} MESSAGES - Centralized error and system messages used throughout the application
 */
const MESSAGES = {
  // Error messages
  ERROR_DOCUMENTATION_UPDATE: "Error generating documentation update prompt: {error}",
  ERROR_DOCUMENTATION_READ: "Error reading project documentation: {error}",
  
  // Server messages
  SERVER_START: "Giga MCP server running on port {port}",
  MESSAGE_RECEIVED: "Received message"
};

const app = express();

/**
 * File Management Utilities
 */
const FileManager = {
  /**
   * Get the path to the .giga directory
   */
  getGigaDir: () => path.join(process.cwd(), '.giga'),

  /**
   * Ensure a directory exists
   */
  ensureDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
  },

  /**
   * Read a file's content
   */
  readFile: (filePath) => {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return '';
  },

  /**
   * Get the path for a specific project file
   */
  getProjectFilePath: (filename) => {
    const gigaDir = FileManager.ensureDir(FileManager.getGigaDir());
    return path.join(gigaDir, filename);
  }
};

/**
 * Create a new MCP server instance
 */
const server = new McpServer({
  name: "giga-mcp",
  version: "1.0.0",
});

/**
 * Get giga_autorun prompt template
 */
server.tool(
  "giga_autorun",
  "Returns a prompt template for automatically updating project documentation with high-level project information",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: PROMPTS.GIGA_AUTORUN
        }
      ]
    };
  }
);

// Setup SSE transport
let transport = null;

app.get("/sse", (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    console.log(MESSAGES.MESSAGE_RECEIVED);
    transport.handlePostMessage(req, res);
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(MESSAGES.SERVER_START.replace('{port}', PORT));
});