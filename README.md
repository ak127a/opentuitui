# OpenTUITUI

A customizable components library built on top of [opentui/core](https://github.com/anomalyco/opentui).

## Features

- **TextField**: Customizable text input component with Ctrl+W support for deleting words backward
- Built for **Bun** runtime
- TypeScript with full type definitions
- Extensible component architecture

## Installation

```bash
# Using Bun
bun add opentuitui

# Using npm
npm install opentuitui

# Using pnpm  
pnpm add opentuitui
```

### Peer Dependencies

This library requires `@opentui/core` to be installed:

```bash
bun add @opentui/core
```

## Usage

### TextField

The `TextField` component extends `InputRenderable` from `@opentui/core` and adds Ctrl+W keyboard shortcut to delete words backward.

```typescript
import { createCliRenderer, BoxRenderable, TextRenderable } from "@opentui/core";
import { TextField } from "opentuitui";

async function main() {
  const renderer = await createCliRenderer();

  const container = new BoxRenderable(renderer, {
    flexDirection: "column",
    width: 60,
    height: 10,
    border: true,
  });

  const textField = new TextField(renderer, {
    placeholder: "Type something and try Ctrl+W...",
    width: 50,
    backgroundColor: "#1f2335",
    focusedBackgroundColor: "#16161e",
    textColor: "#c0caf5",
    cursorColor: "#7aa2f7",
    enableCtrlW: true,
  });

  textField.on("input", (value) => {
    console.log("Input:", value);
  });

  container.add(textField);
  renderer.root.add(container);
  textField.focus();

  renderer.start();
}

main();
```

### TextField Options

```typescript
interface TextFieldOptions {
  // All standard InputRenderable options
  placeholder?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  focusedBackgroundColor?: string;
  textColor?: string;
  focusedTextColor?: string;
  placeholderColor?: string;
  cursorColor?: string;
  maxLength?: number;
  id?: string;

  // TextField-specific option
  enableCtrlW?: boolean; // default: true
}
```

### Events

The `TextField` component supports all standard `InputRenderable` events:

```typescript
textField.on("input", (value) => {
  console.log("Typing:", value);
});

textField.on("change", (value) => {
  console.log("Committed:", value);
});

textField.on("enter", (value) => {
  console.log("Submitted:", value);
});
```

### Keyboard Shortcuts

- **Ctrl+W**: Delete word backward (enabled by default)
- All standard `InputRenderable` shortcuts work as expected

## Publishing

This library is designed to be published to npm/Bun registries. 

### Before Publishing

1. Update the repository URLs in `package.json` with your actual GitHub repository
2. Update the `author` field in `package.json`
3. Update the copyright holder in `LICENSE`
4. Update version using `npm version patch|minor|major`

### To Publish

```bash
# Build the project
bun run build

# Publish to npm (requires npm account)
npm publish

# Or publish with Bun
bun publish
```

### Registry Installation

After publishing, users can install with:

```bash
# From npm
bun add opentuitui

# From GitHub (before publishing to npm)
bun add github:yourusername/opentuitui
```

## Development

### Build

```bash
bun run build
```

This compiles TypeScript to JavaScript and generates declaration files in the `dist/` directory.

### Watch Mode

```bash
bun run dev
```

### Run Demo

```bash
bun run demo
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see [LICENSE](LICENSE) file for details

## Credits

Built on top of [OpenTUI](https://github.com/anomalyco/opentui) - A library for building terminal user interfaces.
