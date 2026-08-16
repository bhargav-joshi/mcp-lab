# Hello World MCP

A minimal **Model Context Protocol (MCP) server** demonstrating how to create and expose a custom AI-callable tool.

## Features

* MCP server using TypeScript
* STDIO transport
* Zod input validation
* Custom `hello` tool
* Local testing with MCP Inspector

## Tool

### `hello`

Accepts a name and returns a greeting.

**Input:**

```json
{
  "name": "Bhargav"
}
```

**Output:**

```text
Hello Bhargav! 👋
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

## Test with MCP Inspector

Run:

```bash
npx @modelcontextprotocol/inspector
```

Connect using STDIO:

```text
Command: npx
Arguments: tsx server.ts
```

Discover the `hello` tool and invoke it with:

```json
{
  "name": "Bhargav"
}
```

## Project Structure

```text
hello-world-mcp/
├── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Learning Outcomes

This project demonstrates the basic MCP lifecycle:

```text
MCP Client
    │
    ▼
MCP Server
    │
    ▼
Tool Discovery
    │
    ▼
Tool Invocation
    │
    ▼
Tool Response
```
