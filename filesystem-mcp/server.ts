import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";


// ========================================
// 1. CREATE MCP SERVER
// ========================================

const server = new McpServer({
    name: "filesystem-mcp",
    version: "1.0.0",
});


// ========================================
// 2. DEFINE SAFE ROOT DIRECTORY
// ========================================

const ROOT_DIR = path.resolve(
    process.env.FS_ROOT ??
    path.join(process.env.HOME!, "Desktop/mcp-data")
);

console.error(`Filesystem root: ${ROOT_DIR}`);


// ========================================
// 3. SECURITY FUNCTION
// ========================================

function resolveSafePath(userPath: string): string {
    const resolvedPath = path.resolve(ROOT_DIR, userPath);

    if (
        resolvedPath !== ROOT_DIR &&
        !resolvedPath.startsWith(ROOT_DIR + path.sep)
    ) {
        throw new Error(
            "Access denied: path is outside the allowed directory"
        );
    }

    return resolvedPath;
}


// ========================================
// 4. LIST FILES
// ========================================

server.registerTool(
    "list_files",
    {
        title: "List Files",
        description: "List files and directories",
        inputSchema: {
            path: z.string().default("."),
        },
    },
    async ({ path: userPath }) => {

        try {

            const safePath = resolveSafePath(userPath);

            const entries = await fs.readdir(safePath, {
                withFileTypes: true,
            });

            const result = entries.map((entry) => ({
                name: entry.name,
                type: entry.isDirectory()
                    ? "directory"
                    : "file",
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Failed to list files: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 5. READ FILE
// ========================================

server.registerTool(
    "read_file",
    {
        title: "Read File",
        description: "Read a text file",
        inputSchema: {
            path: z.string(),
        },
    },
    async ({ path: userPath }) => {

        try {

            const safePath = resolveSafePath(userPath);

            const stats = await fs.stat(safePath);

            if (!stats.isFile()) {
                throw new Error("Path is not a file");
            }

            // Maximum file size = 1 MB
            const MAX_FILE_SIZE = 1024 * 1024;

            if (stats.size > MAX_FILE_SIZE) {
                throw new Error(
                    "File is larger than 1 MB"
                );
            }

            const content = await fs.readFile(
                safePath,
                "utf-8"
            );

            return {
                content: [
                    {
                        type: "text",
                        text: content,
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Failed to read file: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 6. FILE INFORMATION
// ========================================

server.registerTool(
    "file_info",
    {
        title: "File Information",
        description:
            "Get metadata about a file or directory",

        inputSchema: {
            path: z.string(),
        },
    },

    async ({ path: userPath }) => {

        try {

            const safePath =
                resolveSafePath(userPath);

            const stats =
                await fs.stat(safePath);

            return {
                content: [
                    {
                        type: "text",

                        text: JSON.stringify(
                            {
                                path: userPath,

                                size: stats.size,

                                type: stats.isDirectory()
                                    ? "directory"
                                    : "file",

                                created: stats.birthtime,

                                modified: stats.mtime,
                            },

                            null,
                            2
                        ),
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,

                content: [
                    {
                        type: "text",

                        text: `Failed to get file information: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 7. SEARCH FILES
// ========================================

async function searchDirectory(
    directory: string,
    keyword: string,
    results: string[]
): Promise<void> {

    const entries =
        await fs.readdir(directory, {
            withFileTypes: true,
        });

    for (const entry of entries) {

        const fullPath =
            path.join(directory, entry.name);

        if (entry.isDirectory()) {

            await searchDirectory(
                fullPath,
                keyword,
                results
            );

            continue;
        }

        try {

            const content =
                await fs.readFile(
                    fullPath,
                    "utf-8"
                );

            if (
                content
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
            ) {

                results.push(
                    path.relative(
                        ROOT_DIR,
                        fullPath
                    )
                );

            }

        } catch {
            // Ignore binary/unreadable files
        }
    }
}


server.registerTool(
    "search_files",
    {
        title: "Search Files",

        description:
            "Search for text inside files recursively",

        inputSchema: {
            keyword: z.string().min(1),
        },
    },

    async ({ keyword }) => {

        try {

            const results: string[] = [];

            await searchDirectory(
                ROOT_DIR,
                keyword,
                results
            );

            return {
                content: [
                    {
                        type: "text",

                        text:
                            results.length > 0
                                ? results.join("\n")
                                : "No matching files found.",
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,

                content: [
                    {
                        type: "text",

                        text: `Search failed: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 8. CREATE FILE
// ========================================

server.registerTool(
    "create_file",
    {
        title: "Create File",

        description:
            "Create a new text file",

        inputSchema: {
            path: z.string(),
            content: z.string(),
        },
    },

    async ({
        path: userPath,
        content,
    }) => {

        try {

            const safePath =
                resolveSafePath(userPath);

            await fs.writeFile(
                safePath,
                content,
                {
                    encoding: "utf-8",
                    flag: "wx",
                }
            );

            return {
                content: [
                    {
                        type: "text",

                        text:
                            `File created successfully: ${userPath}`,
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,

                content: [
                    {
                        type: "text",

                        text: `Failed to create file: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 9. CREATE DIRECTORY
// ========================================

server.registerTool(
    "create_directory",
    {
        title: "Create Directory",

        description:
            "Create a directory",

        inputSchema: {
            path: z.string(),
        },
    },

    async ({ path: userPath }) => {

        try {

            const safePath =
                resolveSafePath(userPath);

            await fs.mkdir(
                safePath,
                {
                    recursive: true,
                }
            );

            return {
                content: [
                    {
                        type: "text",

                        text:
                            `Directory created: ${userPath}`,
                    },
                ],
            };

        } catch (error) {

            return {
                isError: true,

                content: [
                    {
                        type: "text",

                        text: `Failed to create directory: ${error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`,
                    },
                ],
            };

        }
    }
);


// ========================================
// 10. START MCP SERVER
// ========================================

async function main() {

    const transport =
        new StdioServerTransport();

    await server.connect(
        transport
    );

    console.error(
        "🚀 Filesystem MCP started"
    );
}

main().catch(console.error);