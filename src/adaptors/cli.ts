/**
 * CLI adaptor implementation for generic CLI tools
 * 通用CLI工具的适配器实现 - 支持多种输出格式
 */

import type { Adaptor } from "./base";
import type { CharacterCountResult } from "../core/types";

/**
 * Configuration options for CLIAdaptor
 * CLI适配器的配置选项
 */
export interface CLIAdaptorConfig {
  /**
   * Output format for character count results
   * 字符计数结果的输出格式
   *
   * - "system-reminder": Wrapped in <system-reminder> tags
   * - "json": Raw JSON object
   * - "plain": Simple breakdown string
   */
  outputFormat: "system-reminder" | "json" | "plain";
}

/**
 * Generic CLI adaptor for tools that want character counting
 * 通用CLI适配器 - 为需要字符统计功能的工具提供支持
 *
 * @example
 * ```typescript
 * const adaptor = new CLIAdaptor({ outputFormat: "system-reminder" });
 * adaptor.afterWrite({ title: "Write", output: "..." }, countResult);
 * ```
 */
export class CLIAdaptor implements Adaptor {
  name = "cli-generic";

  constructor(private config: CLIAdaptorConfig = { outputFormat: "system-reminder" }) {}

  afterWrite(args: { title: string; output: string }, result: CharacterCountResult): void {
    const formatted = this.formatOutput(result);
    console.log(formatted);
  }

  /**
   * Format result according to configured output format
   * 根据配置的输出格式格式化结果
   */
  private formatOutput(result: CharacterCountResult): string {
    switch (this.config.outputFormat) {
      case "json":
        return JSON.stringify(result);
      case "plain":
        return result.breakdown;
      case "system-reminder":
      default:
        return `<system-reminder>\n${result.breakdown}\n</system-reminder>`;
    }
  }
}