import { createTool } from "@anvia/core";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { z } from "zod";

const BASE_DIR = process.cwd();

function resolveSafePath(filePath: string): string {
  const resolved = path.resolve(BASE_DIR, filePath);
  return resolved;
}

export const writeFileTool = createTool({
  name: "write_file",
  description:
    "Writes text content to a file in the workspace or output directory (e.g., 'output/carbon_scout_report.md'). Automatically creates parent directories if needed.",
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        "Target file path relative to workspace root (e.g., 'output/carbon_scout_report.md')",
      ),
    content: z.string().describe("Text content or Markdown report to write to the file"),
  }),
  execute: async ({ path: targetPath, content }) => {
    const fullPath = resolveSafePath(targetPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
    return JSON.stringify({
      success: true,
      path: targetPath,
      bytesWritten: Buffer.byteLength(content, "utf8"),
    });
  },
});

export const readFileTool = createTool({
  name: "read_file",
  description:
    "Reads content from a file in the workspace or sandbox directory (e.g., 'output/carbon_scout_report.md').",
  inputSchema: z.object({
    path: z.string().describe("File path to read from"),
  }),
  execute: async ({ path: targetPath }) => {
    const fullPath = resolveSafePath(targetPath);
    try {
      const content = await fs.readFile(fullPath, "utf8");
      return content;
    } catch (error) {
      throw new Error(
        `Failed to read file '${targetPath}': ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
});

export const listFilesTool = createTool({
  name: "list_files",
  description: "Lists files and directories in a given path.",
  inputSchema: z.object({
    path: z.string().optional().default(".").describe("Directory path to inspect"),
  }),
  execute: async ({ path: targetPath }) => {
    const fullPath = resolveSafePath(targetPath);
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      return JSON.stringify(
        entries.map((entry) => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
        })),
      );
    } catch (error) {
      return JSON.stringify({
        error: `Cannot list directory '${targetPath}': ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
});

export const sandboxTools = [writeFileTool, readFileTool, listFilesTool];
