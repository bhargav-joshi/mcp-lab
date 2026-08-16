# File System MCP

A secure local **File System MCP Server** that allows MCP clients to interact with files and directories through controlled tools.

## Features

* List files and directories
* Read text files
* Inspect file metadata
* Recursively search file contents
* Create files
* Create directories
* Root-directory sandboxing
* Path traversal protection
* File-size protection
* Structured error handling

## Tools

| Tool               | Description                |
| ------------------ | -------------------------- |
| `list_files`       | List files and directories |
| `read_file`        | Read a text file           |
| `file_info`        | Get file metadata          |
| `search_files`     | Search text recursively    |
| `create_file`      | Create a new file          |
| `create_directory` | Create a directory         |

## Security

The server operates inside a configurable root directory.

Default:

```text
~/Desktop/mcp-data
```

Paths outside the configured root are rejected.

Example blocked request:

```text
../../package.json
```

The server also limits file reads to **1 MB** to prevent unexpectedly large file operations.

## Setup

Install dependencies:

```bash
npm install
```

Create the sandbox directory:

```bash
mkdir -p ~/Desktop/mcp-data
```

Create test data:

```bash
echo "Hello from MCP" > ~/Desktop/mcp-data/hello.txt
```

Start the server:

```bash
npm run dev
```

## Configuration

The filesystem root can be changed using:

```bash
FS_ROOT=/path/to/directory npm run dev
```

Example:

```bash
FS_ROOT=/Users/bhargavjoshi/Desktop/mcp-data npm run dev
```

## Test with MCP Inspector

Run:

```bash
npx @modelcontextprotocol/inspector
```

Connect using STDIO:

```text
Command: npx
Arguments:
tsx
/path/to/filesystem-mcp/server.ts
```

### Example: List Files

```json
{
  "path": "."
}
```

### Example: Read File

```json
{
  "path": "hello.txt"
}
```

### Example: Search

```json
{
  "keyword": "Angular"
}
```

### Example: Create File

```json
{
  "path": "test/example.txt",
  "content": "Created using MCP"
}
```

## Architecture

```text
MCP Client
     │
     ▼
File System MCP
     │
     ▼
Path Validation
     │
     ▼
Sandbox Root
     │
 ┌───┴──────────────┐
 ▼                  ▼
Read/Search       Create
Files             Files/Dirs
```

## Security Model

```text
Requested Path
      │
      ▼
Resolve Absolute Path
      │
      ▼
Inside Allowed Root?
   ┌──┴──┐
  YES    NO
   │      │
   ▼      ▼
Execute  Reject
```

## Project Structure

```text
filesystem-mcp/
├── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Future Improvements

* Read-only / read-write permission modes
* File delete and move operations
* Regex-based code search
* Audit logging
* File extension restrictions
* Unit and integration tests
* Git integration
* Code/AST analysis
