# 中文字符统计插件

一款为 [opencode](https://github.com/anomalyco/opencode) 打造的插件，在 `write` 工具执行后统计文本字符，并以 `<system-reminder>` 标签形式展示结果。

## 功能特性

- **多类别统计**：中文、英文、数字、标点、空格
- **JSON 输出格式**：结果以 `<system-reminder>` 标签呈现，方便 LLM 查看
- **开关控制**：可通过配置开启/关闭统计功能
- **CLI 适配器接口**：预留接口，可扩展至其他 CLI 工具

## 安装步骤

1. 将插件文件复制到 opencode 插件目录：

```bash
# 创建插件目录（如不存在）
mkdir -p ~/.opencode/plugins/character-counter

# 复制源文件
cp -r src/* ~/.opencode/plugins/character-counter/
```

2. 在 `opencode.json` 中配置插件路径：

```json
{
  "plugins": {
    "paths": ["~/.opencode/plugins/character-counter"]
  }
}
```

## 使用方法

安装完成后，插件将自动启用。使用 `write` 工具后，字符统计数据将以 `<system-reminder>` 标签形式展示：

```json
<system-reminder>
{
  "charCount": {
    "total": 100,
    "chinese": 50,
    "english": 30,
    "number": 10,
    "punctuation": 5,
    "space": 5,
    "time": "2024-01-01T12:00:00.000Z"
  }
}
</system-reminder>
```

### 演示工具

可直接测试统计功能：

```
/character_counter_demo
```

输入任意文本即可查看字符统计。

## 项目结构

```
├── src/
│   ├── index.ts          # 插件入口
│   ├── core/
│   │   ├── counter.ts    # 统计引擎
│   │   └── types.ts      # 类型定义
│   └── adaptors/
│       ├── base.ts       # 适配器接口
│       └── cli.ts       # CLI 适配器
├── tests/
│   └── counter.test.ts   # 单元测试
└── docs/
    └── plans/            # 实施计划文档
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 编译构建
npm run build
```

## 开源协议

MIT
