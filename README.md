# Chinese Character Counter Plugin

A plugin for [opencode](https://github.com/anomalyco/opencode) that counts and categorizes characters in text, displaying statistics in a `<system-reminder>` tag after `write` tool execution.

## Features

- **Multi-category counting**: Chinese, English, Numbers, Punctuation, Spaces
- **JSON output**: Results displayed in `<system-reminder>` tag for LLM reference
- **Toggle support**: Can be enabled/disabled via configuration
- **CLI adaptor interface**: Ready for extension to other CLI tools

## Installation

1. Copy the plugin files to your opencode plugins directory:

```bash
# Create plugins directory if not exists
mkdir -p ~/.opencode/plugins/character-counter

# Copy source files
cp -r src/* ~/.opencode/plugins/character-counter/
```

2. Configure opencode to load the plugin in `opencode.json`:

```json
{
  "plugins": {
    "paths": ["~/.opencode/plugins/character-counter"]
  }
}
```

## Usage

After installation, the plugin automatically activates. When you use the `write` tool, character statistics will be displayed in a `<system-reminder>` tag:

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

### Demo Tool

Test the counter directly:

```
/character_counter_demo
```

Enter any text to see character statistics.

## Project Structure

```
├── src/
│   ├── index.ts          # Plugin entry
│   ├── core/
│   │   ├── counter.ts    # Counting engine
│   │   └── types.ts      # Type definitions
│   └── adaptors/
│       ├── base.ts       # Adaptor interface
│       └── cli.ts        # CLI adaptor
├── tests/
│   └── counter.test.ts   # Unit tests
└── docs/
    └── plans/            # Implementation plans
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT
