import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "hello-mcp",
  version: "1.0.0",
});

server.registerTool(
  "hello",
  {
    title: "Hello Tool",
    description: "Returns a greeting",
    inputSchema: {
      name: z.string(),
    },
  },
  async ({ name }) => ({
    content: [
      {
        type: "text",
        text: `Hello ${name}!`,
      },
    ],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("✅ MCP Server Started");
}

main().catch(console.error);