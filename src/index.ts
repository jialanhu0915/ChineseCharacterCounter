/**
 * Opencode plugin for character counting
 * 字符统计 Opencode 插件 - 拦截 write 工具执行并返回字符统计信息
 */

import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin/tool";
import { countCharacters, formatSystemReminder } from "./core/counter";
import type { CharacterCountResult } from "./core/types";

/**
 * Character counter plugin for opencode
 * Opencode 字符统计插件
 *
 * Features:
 * - Intercepts "write" tool execution
 * - Counts characters by type (Chinese, English, digits, punctuation, whitespace)
 * - Appends formatted count result to tool output
 *
 * 功能：
 * - 拦截 "write" 工具执行
 * - 按类型统计字符（中文、英文、数字、标点、空格）
 * - 将格式化的统计结果附加到工具输出
 *
 * @example
 * ```json
 * {
 *   "plugin": ["/path/to/dist/index.js"]
 * }
 * ```
 */
const CharacterCounterPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      character_counter_demo: tool({
        description: "Demo tool to test character counting / 测试字符统计的演示工具",
        args: {
          text: tool.schema.string().describe("Text to count characters in / 要统计字符的文本"),
        },
        async execute(args) {
          const result = countCharacters(args.text);
          return formatSystemReminder(result);
        },
      }),
    },
    "tool.execute.after": async (input, output) => {
      if (input.tool === "write") {
        const content = extractWriteContent(input.args);
        if (content) {
          const result = countCharacters(content);
          const reminder = formatSystemReminder(result);
          output.output = `${output.output}\n\n${reminder}`;
        }
      }
    },
  };
};

export const server = CharacterCounterPlugin;
export default CharacterCounterPlugin;

/**
 * Extract content from write tool arguments
 * 从 write 工具参数中提取内容
 *
 * @param args - Tool arguments / 工具参数
 * @returns Extracted content string or null / 提取的内容字符串，失败返回 null
 */
function extractWriteContent(args: unknown): string | null {
  if (typeof args === "object" && args !== null && "content" in args) {
    return String((args as Record<string, unknown>)["content"]);
  }
  return null;
}

export { countCharacters, formatSystemReminder };
export type { CharacterCountResult };