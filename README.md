# 🧩 MCP Lab

> **Exploring how AI connects with real-world tools through Model Context Protocol.**

A collection of practical **Model Context Protocol (MCP) servers** built with TypeScript and Node.js.

This repository explores how AI assistants can securely interact with **tools, local systems, APIs, and data** through MCP.


## Projects

| Project                              | Description                                                     | Key Concepts                                  |
| ------------------------------------ | --------------------------------------------------------------- | --------------------------------------------- |
| [Hello World MCP](./hello-world-mcp) | Minimal MCP server demonstrating tool creation and invocation   | MCP, Tools, Zod, STDIO                        |
| [File System MCP](./filesystem-mcp)  | Secure local filesystem MCP with file operations and sandboxing | Filesystem, Security, Path Validation, Search |

## Architecture

```text
AI Assistant / MCP Client
          │
          │ MCP / STDIO
          ▼
    ┌───────────────┐
    │   MCP Server  │
    └───────┬───────┘
            │
      ┌─────┴─────┐
      ▼           ▼
    Tools       Resources
      │
      ▼
 External Systems / Local Files
```

## Tech Stack

* TypeScript
* Node.js
* Model Context Protocol (MCP)
* Zod
* MCP Inspector
* STDIO Transport

## Quick Start

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd mcp-lab
```

Each MCP server is an independent Node.js project.

### Hello World MCP

```bash
cd hello-world-mcp
npm install
npm run dev
```

### File System MCP

```bash
cd filesystem-mcp
npm install
npm run dev
```

> `node_modules` is intentionally excluded from Git. Run `npm install` inside each project after cloning.

## Testing

Both servers can be tested locally using **MCP Inspector**.

```bash
npx @modelcontextprotocol/inspector
```

The Inspector provides a browser-based interface for connecting to an MCP server, discovering tools, and testing tool inputs and outputs.

## Roadmap

* [x] Hello World MCP
* [x] File System MCP


## About

Built as a hands-on exploration of **MCP, AI tool integration, agentic workflows, and secure system access**.

More MCP projects will be added as the lab evolves.
