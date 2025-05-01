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
DO NOT ADD ANYTHING THAT THE USER HAS NOT EXPLICITLY SAID. Do not create additional details, do not add more info, just write the LEAST amount of info that the user has asked for.
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
`,
  GIGA_PUSH_FEATURE: `This command is called after the user has finished writing code for a feature.

  Your job now is to commit the work, then create a new pull request on github for this.

  Choose suitable commit message, branch name, etc. Ensure everything is short and descriptive, no buzzwords, very simple language.
  
  Your job is to EXECUTE all the following commands, first confirm with the user about commit message and branch name, and tell them what you're going to do.

  Commands to execute:
    git checkout -b feature/your-feature-name # Create a new feature branch
    git add . # Add all changes to the staging area
    git commit -m "Your commit message" # Commit the changes
    git push -u origin feature/your-feature-name # Push the changes to the remote repository

    # Create a new pull request
    gh pr create --base main --head feature/your-feature-name --title "Your PR title" --body "Description of your changes"
  `,

  GIGA_MERGE_FEATURE: `This command is called after the user has finished reviewing the pull request.

  Your job now is to merge the pull request on github.

  Commands to execute:
    gh pr merge --auto --squash # Merge the pull request
  `
};

/**
 * Create a new MCP server instance
 */
const server = new McpServer({
  name: "giga-manager",
  version: "1.0.0",
});

/**
 * Helper function to register a tool that returns a prompt template
 * @param {string} name - The name of the tool
 * @param {string} description - The description of the tool
 * @param {string} promptKey - The key in PROMPTS object for the template
 */
function registerPromptTool(name, description, promptKey) {
  server.tool(
    name,
    description,
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: PROMPTS[promptKey]
          }
        ]
      };
    }
  );
}

/**
 * Register all tools
 */
registerPromptTool(
  "giga_autorun",
  "Returns a prompt template for automatically updating project documentation with high-level project information",
  "GIGA_AUTORUN"
);

registerPromptTool(
  "giga_push_feature",
  "Returns a prompt template for pushing feature changes and creating a pull request",
  "GIGA_PUSH_FEATURE"
);

registerPromptTool(
  "giga_merge_feature",
  "Returns a prompt template for merging a pull request",
  "GIGA_MERGE_FEATURE"
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
