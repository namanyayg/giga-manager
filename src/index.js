import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/**
 * A map of mock MCPs available for installation
 * In a real implementation, this would be fetched from a registry or API
 */
const AVAILABLE_MCPS = {
  "supabase": {
    name: "supabase",
    description: "Connect to Supabase databases and services",
    installation: {
      command: "npx -y @supabase/mcp-server-supabase@latest --access-token",
    },
    category: "database",
  },
  "prisma": {
    name: "prisma",
    description: "Connect to Prisma databases and services",
    installation: {
      command: "npx -y prisma mcp",
    },
    category: "database",
  },
};

/**
 * Helper function to format MCP responses
 * @param {Object|Array} data - The data to include in the response
 * @param {String|null} errorMessage - Optional error message
 * @returns {Object} Formatted MCP response
 */
function formatMcpResponse(data, errorMessage = null) {
  if (errorMessage || !data) {
    return {
      content: [
        {
          type: "text",
          text: errorMessage || "Failed to process request",
        },
      ],
    };
  }

  // If data is an object or array, convert to formatted JSON string
  const formattedData = typeof data === 'object' 
    ? JSON.stringify(data, null, 2)
    : data.toString();

  return {
    content: [
      {
        type: "text",
        text: formattedData,
      },
    ],
  };
}

/**
 * Parse a package.json file to extract dependencies
 * @param {String} content - Content of package.json
 * @returns {Object} Object containing dependencies, devDependencies
 */
function parsePackageJson(content) {
  try {
    const packageData = JSON.parse(content);
    return {
      dependencies: packageData.dependencies || {},
      devDependencies: packageData.devDependencies || {}
    };
  } catch (error) {
    console.error("Error parsing package.json:", error);
    return { dependencies: {}, devDependencies: {} };
  }
}

/**
 * Parse a requirements.txt file to extract dependencies
 * @param {String} content - Content of requirements.txt
 * @returns {Array} Array of dependency strings
 */
function parseRequirementsTxt(content) {
  // Split by newline and filter out empty lines and comments
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

/**
 * Analyze dependencies and suggest relevant MCPs
 * @param {Object} dependencyData - The extracted dependencies
 * @param {String} fileType - Type of dependency file ('package.json' or 'requirements.txt')
 * @returns {Array} Suggested MCPs with relevance scores
 */
function analyzeDependenciesAndSuggestMcps(dependencyData, fileType) {
  // In a real implementation, this would use a more sophisticated algorithm
  // to match dependencies to relevant MCPs
  
  const suggestions = [];
  const dependencyList = fileType === 'package.json' 
    ? [...Object.keys(dependencyData.dependencies), ...Object.keys(dependencyData.devDependencies)]
    : dependencyData;

  // Mock suggestion logic - in real implementation, this would be more sophisticated
  const dependencyMatchers = [
    { 
      patterns: ['supabase'], 
      mcp: AVAILABLE_MCPS.supabase, 
      relevance: 0.85, 
      reason: "Supabase or PostgreSQL dependencies detected" 
    },
    { 
      patterns: ['prisma'], 
      mcp: AVAILABLE_MCPS.prisma, 
      relevance: 0.8, 
      reason: "Prisma dependencies detected" 
    }
  ];

  dependencyMatchers.forEach(matcher => {
    if (dependencyList.some(dep => matcher.patterns.some(pattern => dep.includes(pattern)))) {
      suggestions.push({
        mcp: matcher.mcp,
        relevance: matcher.relevance,
        reason: matcher.reason
      });
    }
  });

  return suggestions.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Create a new MCP server instance
 */
const server = new McpServer({
  name: "mcp-recommender",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools

/**
 * List all available MCPs
 */
server.tool(
  "list_available_mcps",
  "List all available Model Context Protocol (MCP) packages",
  {
    category: z.string().optional().describe("Filter MCPs by category"),
    sort_by: z.enum(["name", "popularity"]).optional().describe("Sort results by name or popularity"),
  },
  async ({ category, sort_by }) => {
    let mcps = Object.values(AVAILABLE_MCPS);
    
    // Apply category filter if provided
    if (category) {
      mcps = mcps.filter(mcp => mcp.category === category);
    }
    
    // Apply sorting if provided
    if (sort_by) {
      mcps = sort_by === "name" 
        ? mcps.sort((a, b) => a.name.localeCompare(b.name))
        : mcps.sort((a, b) => b.popularity - a.popularity);
    }
    
    return formatMcpResponse(mcps);
  }
);

/**
 * Get details about a specific MCP
 */
server.tool(
  "get_mcp_details",
  "Get detailed information about a specific MCP",
  {
    mcp_name: z.string().describe("Name of the MCP to get details for"),
  },
  async ({ mcp_name }) => {
    const mcp = AVAILABLE_MCPS[mcp_name.toLowerCase()];
    
    if (!mcp) {
      return formatMcpResponse(null, `MCP '${mcp_name}' not found`);
    }
    
    return formatMcpResponse(mcp);
  }
);

/**
 * Suggest MCPs based on dependencies in package.json or requirements.txt
 */
server.tool(
  "suggest_mcps",
  "Suggest relevant MCPs based on project dependencies",
  {
    file_content: z.string().describe("Content of package.json or requirements.txt file"),
    file_type: z.enum(["package.json", "requirements.txt"]).describe("Type of dependency file"),
  },
  async ({ file_content, file_type }) => {
    try {
      let dependencyData;
      
      if (file_type === "package.json") {
        dependencyData = parsePackageJson(file_content);
      } else {
        dependencyData = parseRequirementsTxt(file_content);
      }

      console.log("Dependency data:", dependencyData);
      
      const suggestions = analyzeDependenciesAndSuggestMcps(dependencyData, file_type);
      
      if (suggestions.length === 0) {
        return formatMcpResponse({ 
          suggestions: [],
          message: "No relevant MCPs found based on your dependencies."
        });
      }
      
      return formatMcpResponse({ suggestions });
    } catch (error) {
      console.error("Error suggesting MCPs:", error);
      return formatMcpResponse(null, `Error analyzing dependencies: ${error.message}`);
    }
  }
);

/**
 * Install MCPs for the user
 */
server.tool(
  "install_mcps",
  "Install specified MCPs in the project",
  {
    mcps: z.array(z.string()).describe("Array of MCP names to install"),
    package_manager: z.enum(["npm", "pip"]).describe("Package manager to use for installation"),
    dev_dependency: z.boolean().optional().default(false).describe("Install as dev dependency (npm only)"),
  },
  async ({ mcps}) => {
    try {
      // Validate MCPs exist
      const invalidMcps = mcps.filter(name => !AVAILABLE_MCPS[name.toLowerCase()]);
      if (invalidMcps.length > 0) {
        return formatMcpResponse(null, `Invalid MCP names: ${invalidMcps.join(', ')}`);
      }
      
      // Generate installation commands for each MCP
      const installCommands = mcps.map(name => {
        const mcp = AVAILABLE_MCPS[name.toLowerCase()];
        return `npx install-mcp ${mcp.installation.command || ''}`;
      });
      
      // Create a formatted response with copyable commands
      const commandsText = installCommands.join('\n');
      
      return formatMcpResponse({
        commands: installCommands,
        message: "Copy and run the following commands to install the selected MCPs:",
        commandsText: `\`\`\`bash\n${commandsText}\n\`\`\``
      });
    } catch (error) {
      console.error("Error installing MCPs:", error);
      return formatMcpResponse(null, `Error installing MCPs: ${error.message}`);
    }
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
    console.log("Received message");
    transport.handlePostMessage(req, res);
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`MCP Recommender server running on port ${PORT}`);
});