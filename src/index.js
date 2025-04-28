import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

STRICTLY only add what the user explicitly had asked for, DO NOT add any other information yourself.
</ProjectMemory>
`
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Giga MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
