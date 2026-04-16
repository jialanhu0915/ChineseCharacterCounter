/**
 * Type definitions for character counter
 * 字符统计类型定义
 */

/**
 * Result of character counting operation
 * 字符统计操作的结果
 *
 * @example
 * ```typescript
 * const result: CharacterCountResult = {
 *   chinese: 10,
 *   english: 5,
 *   digits: 3,
 *   punctuation: 2,
 *   whitespace: 1,
 *   total: 21,
 *   breakdown: "Cn:10 En:5 Num:3 Punct:2 Space:1 Total:21"
 * };
 * ```
 */
export interface CharacterCountResult {
  /** Number of Chinese characters (CJK) / 中文字符数量 */
  chinese: number;

  /** Number of English letters (A-Z, a-z) / 英文字母数量 */
  english: number;

  /** Number of digits (0-9) / 数字数量 */
  digits: number;

  /** Number of punctuation marks / 标点符号数量 */
  punctuation: number;

  /** Number of whitespace characters / 空白字符数量 */
  whitespace: number;

  /** Total count of all characters / 所有字符的总数 */
  total: number;

  /** Human-readable breakdown string / 人类可读的分类统计字符串 */
  breakdown: string;
}

/**
 * Configuration for counter output formatting
 * 计数器输出格式化配置
 */
export interface CounterConfig {
  /** Whether to show breakdown / 是否显示分类统计 */
  showBreakdown: boolean;

  /** Line separator for multi-line output / 多行输出的行分隔符 */
  separator: string;
}

/**
 * Result structure for write operations (reserved for future use)
 * 写入操作的结果结构（预留供将来使用）
 */
export interface WriteResult {
  /** Operation title / 操作标题 */
  title: string;

  /** Operation output / 操作输出 */
  output: string;

  /** Optional metadata / 可选的元数据 */
  metadata?: Record<string, unknown>;
}