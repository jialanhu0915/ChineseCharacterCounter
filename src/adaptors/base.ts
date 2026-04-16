/**
 * Base adaptor interface for CLI tools
 * CLI工具的基类适配器接口 - 定义通用钩子规范
 */

import type { CharacterCountResult } from "../core/types";

/**
 * Adaptor interface for hooking into write operations
 * 定义写入操作钩子的适配器接口
 *
 * @example
 * ```typescript
 * class MyAdaptor implements Adaptor {
 *   name = "my-cli";
 *   afterWrite(args, result) {
 *     console.log(`Wrote ${result.total} characters`);
 *   }
 * }
 * ```
 */
export interface Adaptor {
  /** Unique name identifying this adaptor / 唯一标识此适配器的名称 */
  name: string;

  /**
   * Callback fired after a write operation completes
   * 写入操作完成后的回调
   *
   * @param args - Write operation result containing title and output / 包含标题和输出的写入操作结果
   * @param result - Character counting result / 字符统计结果
   */
  afterWrite(args: { title: string; output: string }, result: CharacterCountResult): void;
}

/**
 * Context information passed to adaptors
 * 传递给适配器的上下文信息
 */
export interface AdaptorContext {
  /** Current session ID / 当前会话ID */
  sessionID: string;

  /** Current working directory / 当前工作目录 */
  directory: string;
}