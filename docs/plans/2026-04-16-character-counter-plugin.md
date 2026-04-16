# Character Counter Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an opencode plugin that monitors `write` tool executions, counts inserted text (Chinese characters, English characters, punctuation, etc.), and returns statistics via `<system-reminder>` tags. Architecture should be extensible for other CLI tools.

**Architecture:** A plugin-based architecture with:
1. Core character counting engine (pure function, no dependencies)
2. Opencode plugin hook for `tool.execute.after` on `write` tool
3. Adaptor interface for future CLI tool support
4. Output formatting with configurable display

**Tech Stack:** TypeScript, Node.js, @opencode-ai/plugin SDK, Zod

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/index.ts` (plugin entry point)
- Create: `src/core/counter.ts` (character counting engine)
- Create: `src/core/types.ts` (TypeScript interfaces)
- Create: `src/adaptors/base.ts` (adaptor interface)

**Step 1: Create project structure**

```bash
mkdir -p src/core src/adaptors
```

**Step 2: Create package.json**

```json
{
  "name": "@opencode-ai/plugin-character-counter",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@opencode-ai/plugin": "^1.3.15",
    "zod": "^4.1.8"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.8.0"
  }
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

**Step 4: Create src/core/types.ts**

```typescript
export interface CharacterCountResult {
  chinese: number;
  english: number;
  digits: number;
  punctuation: number;
  whitespace: number;
  total: number;
  breakdown: string;
}

export interface CounterConfig {
  showBreakdown: boolean;
  separator: string;
}

export interface WriteResult {
  title: string;
  output: string;
  metadata?: Record<string, unknown>;
}
```

**Step 5: Create src/core/counter.ts**

```typescript
import type { CharacterCountResult, CounterConfig } from "./types";

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
    breakdown: `中${chinese} 英${english} 数${digits} 标${punctuation} 空${whitespace} 总${total}`,
  };
}

function isChineseChar(code: number): boolean {
  return (code >= 0x4E00 && code <= 0x9FFF) ||
         (code >= 0x3400 && code <= 0x4DBF) ||
         (code >= 0x20000 && code <= 0x2A6DF);
}

function isEnglishChar(code: number): boolean {
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function isDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

function isPunctuation(code: number): boolean {
  return (code >= 33 && code <= 47) ||
         (code >= 58 && code <= 64) ||
         (code >= 91 && code <= 96) ||
         (code >= 123 && code <= 126);
}

function isWhitespace(code: number): boolean {
  return code === 32 || code === 9 || code === 10 || code === 13;
}

export function formatSystemReminder(
  result: CharacterCountResult,
  config: CounterConfig = { showBreakdown: true, separator: "\n" }
): string {
  const lines = [
    `# Character Counter`,
    `| 类型 | 数量 |`,
    `|------|------|`,
    `| 中文 | ${result.chinese} |`,
    `| 英文 | ${result.english} |`,
    `| 数字 | ${result.digits} |`,
    `| 标点 | ${result.punctuation} |`,
    `| 空格 | ${result.whitespace} |`,
    `| **总计** | **${result.total}** |`,
  ];
  return lines.join(config.separator);
}
```

**Step 6: Create src/adaptors/base.ts**

```typescript
import type { CharacterCountResult } from "../core/types";

export interface Adaptor {
  name: string;
  afterWrite(args: { title: string; output: string }, result: CharacterCountResult): void;
}

export interface AdaptorContext {
  sessionID: string;
  directory: string;
}
```

**Step 7: Create src/index.ts (main plugin)**

```typescript
import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin/tool";
import { countCharacters, formatSystemReminder } from "./core/counter";

export const CharacterCounterPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      character_counter_demo: tool({
        description: "Demo tool to test character counting",
        args: {
          text: tool.schema.string().describe("Text to count characters in"),
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
          output.title = `${output.title}\n\n${reminder}`;
        }
      }
    },
  };
};

function extractWriteContent(args: unknown): string | null {
  if (typeof args === "object" && args !== null && "content" in args) {
    return String((args as Record<string, unknown>)["content"]);
  }
  return null;
}
```

**Step 8: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

---

## Task 2: Opencode Configuration

**Files:**
- Modify: `opencode.json` (add plugin path)

**Step 1: Update opencode.json plugin config**

```json
{
  "plugin": [
    "./path/to/your/plugin/dist/index.js"
  ]
}
```

**Step 2: Verify plugin loads**

Run: Restart opencode, check logs for plugin initialization

---

## Task 3: Testing

**Files:**
- Create: `src/__tests__/counter.test.ts`

**Step 1: Write tests**

```typescript
import { countCharacters } from "../core/counter";

describe("countCharacters", () => {
  test("counts Chinese characters", () => {
    const result = countCharacters("你好世界");
    expect(result.chinese).toBe(4);
    expect(result.total).toBe(4);
  });

  test("counts English characters", () => {
    const result = countCharacters("hello world");
    expect(result.english).toBe(10);
    expect(result.total).toBe(10);
  });

  test("counts mixed content", () => {
    const result = countCharacters("你好Hello123!");
    expect(result.chinese).toBe(2);
    expect(result.english).toBe(5);
    expect(result.digits).toBe(3);
    expect(result.punctuation).toBe(1);
  });
});
```

**Step 2: Run tests**

Run: `npm test`
Expected: All tests pass

---

## Task 4: Documentation & CLI Adaptor Interface

**Files:**
- Create: `src/adaptors/cli.ts` (interface for other CLI tools)
- Create: `README.md`

**Step 1: Create CLI adaptor interface**

```typescript
import type { Adaptor, AdaptorContext } from "./base";
import type { CharacterCountResult } from "../core/types";

export interface CLIAdaptorConfig {
  outputFormat: "system-reminder" | "json" | "plain";
}

export class CLIAdaptor implements Adaptor {
  name = "cli-generic";
  
  constructor(private config: CLIAdaptorConfig) {}

  afterWrite(args: { title: string; output: string }, result: CharacterCountResult): void {
    const formatted = this.formatOutput(result);
    console.log(formatted);
  }

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
```

---

## Task 5: Build & Package

**Files:**
- Create: `.gitignore`
- Modify: `package.json` (add files field)

**Step 1: Build**

Run: `npm run build`
Expected: `dist/` folder created with compiled JS

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Project setup + core counting engine |
| 2 | Opencode plugin configuration |
| 3 | Unit tests |
| 4 | CLI adaptor interface (extensibility) |
| 5 | Build & package |

**Plan complete.** Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**