# OpenTUITUI

A customizable components library built on top of [opentui/core](https://github.com/anomalyco/opentui).

## Features

- **TextField**: Customizable text input component with:
  - Ctrl+W support for deleting words backward
  - Platform-agnostic paste support (Ctrl+V / Cmd+V)
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

## Demo

Try out the components in an interactive demo:

```bash
bun run demo
```

This will launch a terminal UI showcasing the TextField component with full interactivity.

## Usage

### TextField

The `TextField` component extends `InputRenderable` from `@opentui/core` and adds:
- **Ctrl+W**: Delete word backward
- **Ctrl+V / Cmd+V**: Platform-agnostic paste from system clipboard

The paste functionality works across different platforms:
- **macOS**: Uses `pbpaste`
- **Linux**: Supports both Wayland (`wl-paste`) and X11 (`xclip`)
- **Windows**: Uses PowerShell's `Get-Clipboard`

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
    placeholder: "Type something and try Ctrl+W or Ctrl+V...",
    width: 50,
    backgroundColor: "#1f2335",
    focusedBackgroundColor: "#16161e",
    textColor: "#c0caf5",
    cursorColor: "#7aa2f7",
    enableCtrlW: true,
    enablePaste: true,
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
  enablePaste?: boolean; // default: true
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
- **Ctrl+V** (Windows/Linux) or **Cmd+V** (macOS): Paste from system clipboard (enabled by default)
- All standard `InputRenderable` shortcuts work as expected

### Platform Requirements for Paste

The paste functionality requires platform-specific clipboard utilities:
- **macOS**: Built-in `pbpaste` (no additional installation needed)
- **Linux (Wayland)**: Install `wl-clipboard` (`sudo apt install wl-clipboard`)
- **Linux (X11)**: Install `xclip` (`sudo apt install xclip`)
- **Windows**: Built-in PowerShell (no additional installation needed)

## Development

```bash
# Build the project
bun run build

# Watch mode during development
bun run dev

# Run interactive demo
bun run demo
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see [LICENSE](LICENSE) file for details

## Credits

Built on top of [OpenTUI](https://github.com/anomalyco/opentui) - A library for building terminal user interfaces.
