import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const FILEPATHS = {
  MEMORY: ".giga/memory/memory.md",
  PLANS_DIR: ".giga/plans/",
}

/**
 * @type {Object.<string, string>} PROMPTS - Centralized prompts used throughout the application
 */
const PROMPTS = {
  // Giga autorun prompt
  GIGA_AUTORUN: `You are an expert project manager and help the user in managing their project and tasks.

FOR EVERY PROMPT BY THE USER, ALWAYS FIRST READ THE PROJECT MEMORY:

${FILEPATHS.MEMORY}

TO HAVE FULL CONTEXT, THEN RESPOND.

Based on the conversation, you might need to update the memory file. ALWAYS DO THAT WITH THE LEAST AMOUNT OF TEXT, NO OVERLY DETAILED EXPLANATIONS, NO BUZZWORDS, NO FLUFF.
DO NOT ADD ANYTHING THAT THE USER HAS NOT EXPLICITLY SAID. Do not create additional details, do not add more info, just write the LEAST amount of info that the user has asked for.
FOLLOW ALL INSTRUCTIONS BELOW EVERY TIME YOU TALK:

<Memory>
FILE: ${FILEPATHS.MEMORY}

First, review the memory file FULLY. 

If the file does not exist, ASK THE USER more details about what they want to do and create the file with EXACTLY what they say (don't add useless extra info)

If the user is saying something that contradicts the current memory, ASK the user, then update the memory to reflect the new information.

Each and EVERY WORD in the memory must be accurate, if you think the memory is wrong, ASK THE USER AND REMOVE IRRELEVANT INFORMATION.

The memory file contains:
- Project architecture and design decisions
- Core functionality and features
- Important technical decisions and their rationale
- Project goals and objectives
- Project preferences and instructions
- Code style preferences
- Technical library preferences
- Any general instructions about the project
- Any other project-related information the user wants to remember

While managing this, it is MOST IMPORTANT to not hallucinate or make up information. Write less, but be accurate about what the user has said. Rather than hallucinating information, ASK THE USER FOR MORE INFORMATION if you are unsure.

The memory serves as a single source of truth for ALL project information, technical understanding, and preferences.
</Memory>
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
    gh pr merge --auto --squash --delete-branch # Merge the pull request
  `,
  GIGA_PLAN: `You are an expert project planner. The user wants to plan a new feature.

The user will invoke this by saying "giga plan <feature explanation>".

Your tasks are:

1.  **Understand the Feature:**
    *   Carefully read the "<feature explanation>" provided by the user.
    *   Identify the core requirements and goals of this feature.
    *   Use the project memory (\`${FILEPATHS.MEMORY}\`) to understand the project context.

2.  **Gather Context & Clarify:**
    *   Based on the feature explanation, identify all potentially relevant files in the codebase that might need to be read, modified, or created.
    *   Provide other similar files in the plan as well, to provide as examples to the AI so it can use existing patterns.
    *   List these files for the user.
    *   If the feature explanation is unclear, or if you need more details to create an effective plan, ASK THE USER clarifying questions. Do not proceed with a vague understanding.

3.  **Create a Plan File:**
    *   Once you have sufficient clarity and have identified relevant files:
        *   Create a new plan file. The filename should be descriptive of the feature (e.g., \`feature-name-plan.md\`) and located under the \`${FILEPATHS.PLANS_DIR}\` directory.
        *   The plan should be written in markdown.

4.  **Plan Content Guidelines:**
    *   **Simplicity is Key:** The plan must be the simplest possible path to implement the feature. Avoid over-engineering, buzzwords, and unnecessary complications.
    *   **File References:** CRITICALLY IMPORTANT: Explicitly list all relevant files that will be involved in implementing this feature (e.g., files to be created, modified, or consulted). This provides full context.
    *   **Clear Steps:** Outline the steps needed to implement the feature in a clear, concise, and actionable manner.
    *   **No Code Implementation:** This is a planning phase. Do NOT write any code in the plan file itself. Focus on *what* needs to be done, not *how* it's done in terms of actual code.

Example plan structure:

\`\`\`markdown
# Plan for: <Feature Name>

**Feature Description:** <Brief re-statement of the feature>

**Relevant Files:**
*   \`src/module/file1.js\` (modification)
*   \`src/new_feature/component.jsx\` (creation)
*   \`docs/api/feature.md\` (creation/update)

**Clarifying Questions Asked (and Answers):**
*   Q: <Your question to the user>
    A: <User's answer>

**Steps:**
1. Provide steps to implement the feature here.
\`\`\`

IN THE PLAN, ALWAYS STRESS WRITING SIMPLEST AND EASIEST CODE TO IMPLEMENT THE RESULT.
FIRST REFER TO THE MEMORY FILE TO UNDERSTAND THE PROJECT.
STRICTLY DO NOT WRITE ANY CODE, ONLY PLAN AND CREATE THE PLAN FILE FOR NOW. 
TRY AND ANSWER ALL QUESTIONS YOURSELF FIRST, IF YOU ARE UNABLE TO ANSWER, THEN ASK THE USER. ASK QUESTIONS IN A SIMPLE AND SHORT WAY, DONT MAKE THE USER READ. 
DO NOT DO WRITE ANY CODE OR DO ANY IMPLEMENTATION, JUST CREATE THE PLAN FILE.
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
  "Returns a prompt template for automatically updating project memory with high-level project information",
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

registerPromptTool(
  "giga_plan",
  "Generates a plan for a new feature, identifying relevant files and asking clarifying questions.",
  "GIGA_PLAN"
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
