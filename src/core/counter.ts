/**
 * Character counting engine
 * 字符统计引擎 - 提供中英文混合文本的字符分类统计功能
 */

import type { CharacterCountResult, CounterConfig } from "./types";

/**
 * Count characters in text and categorize them by type
 * 统计文本中的字符并按类型分类
 *
 * @param text - Input text to analyze / 要分析的输入文本
 * @returns CharacterCountResult with breakdown by category / 返回按类别细分的统计结果
 *
 * @example
 * ```typescript
 * const result = countCharacters("你好Hello123!");
 * // { chinese: 2, english: 5, digits: 3, punctuation: 1, whitespace: 0, total: 11 }
 * ```
 */
export function countCharacters(text: string): CharacterCountResult {
  let chinese = 0;
  let english = 0;
  let digits = 0;
  let punctuation = 0;
  let whitespace = 0;

  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (isChineseChar(code)) {
      chinese++;
    } else if (isEnglishChar(code)) {
      english++;
    } else if (isDigit(code)) {
      digits++;
    } else if (isPunctuation(code)) {
      punctuation++;
    } else if (isWhitespace(code)) {
      whitespace++;
    }
  }

  const total = chinese + english + digits + punctuation + whitespace;

  return {
    chinese,
    english,
    digits,
    punctuation,
    whitespace,
    total,
    breakdown: `Cn:${chinese} En:${english} Num:${digits} Punct:${punctuation} Space:${whitespace} Total:${total}`,
  };
}

/**
 * Check if character code point is a Chinese character (CJK Unified Ideographs)
 * 检查码点是否为中文字符（CJK统一表意文字）
 */
function isChineseChar(code: number): boolean {
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf) ||
    (code >= 0x20000 && code <= 0x2a6df)
  );
}

/**
 * Check if character code point is an English letter (A-Z, a-z)
 * 检查码点是否为英文字母
 */
function isEnglishChar(code: number): boolean {
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/**
 * Check if character code point is a digit (0-9)
 * 检查码点是否为数字
 */
function isDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

/**
 * Check if character code point is punctuation
 * Checks common punctuation ranges: !-/ :@ ` [-` {~ DEL
 * 检查码点是否为标点符号
 */
function isPunctuation(code: number): boolean {
  return (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126)
  );
}

/**
 * Check if character code point is whitespace
 * Includes: space (32), tab (9), newline (10), carriage return (13)
 * 检查码点是否为空格或空白字符
 */
function isWhitespace(code: number): boolean {
  return code === 32 || code === 9 || code === 10 || code === 13;
}

/**
 * Format the counting result as a JSON string wrapped in system-reminder tag
 * 将统计结果格式化为 JSON 字符串，用 system-reminder 标签包裹
 *
 * @param result - CharacterCountResult from countCharacters() / countCharacters() 返回的结果
 * @returns JSON string wrapped in <system-reminder> tags / 用 <system-reminder> 标签包裹的 JSON 字符串
 *
 * @example
 * ```typescript
 * const result = countCharacters("你好世界");
 * const reminder = formatSystemReminder(result);
 * // Output:
 * // <system-reminder>
 * // {"type":"character_count","chinese":4,"english":0,"digits":0,"punctuation":0,"whitespace":0,"total":4}
 * // </system-reminder>
 * ```
 */
export function formatSystemReminder(result: CharacterCountResult): string {
  const jsonOutput = JSON.stringify({
    type: "character_count",
    chinese: result.chinese,
    english: result.english,
    digits: result.digits,
    punctuation: result.punctuation,
    whitespace: result.whitespace,
    total: result.total,
  });
  return `<system-reminder>\n${jsonOutput}\n</system-reminder>`;
}