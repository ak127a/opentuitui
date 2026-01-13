import { createCliRenderer, BoxRenderable, TextRenderable, InputRenderableEvents, TextAttributes } from "@opentui/core";
import { TextField, TextFieldOptions } from "../src/index.js";

async function main() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 60,
  });

  renderer.setBackgroundColor("#1a1b26");

  const container = new BoxRenderable(renderer, {
    id: "container",
    flexDirection: "column",
    gap: 1,
    width: 70,
    height: 12,
    border: true,
    borderColor: "#7aa2f7",
    backgroundColor: "#24283b",
  });

  const title = new TextRenderable(renderer, {
    id: "title",
    content: "OpenTUITUI - TextField Demo",
    fg: "#7aa2f7",
    attributes: TextAttributes.BOLD,
  });
  container.add(title);

  const subtitle = new TextRenderable(renderer, {
    id: "subtitle",
    content: "Try typing and press Ctrl+W to delete the last word",
    fg: "#c0caf5",
  });
  container.add(subtitle);

  const textFieldOptions: TextFieldOptions = {
    id: "text-input",
    placeholder: "Type something here and try Ctrl+W...",
    width: 66,
    height: 1,
    backgroundColor: "#1f2335",
    focusedBackgroundColor: "#16161e",
    textColor: "#c0caf5",
    focusedTextColor: "#ffffff",
    placeholderColor: "#565f89",
    cursorColor: "#7aa2f7",
    maxLength: 100,
    enableCtrlW: true,
  };

  const textField = new TextField(renderer, textFieldOptions);

  textField.on(InputRenderableEvents.INPUT, (value) => {
    console.log("Input:", value);
  });

  textField.on(InputRenderableEvents.CHANGE, (value) => {
    console.log("Change:", value);
  });

  textField.on(InputRenderableEvents.ENTER, (value) => {
    console.log("Submitted:", value);
  });

  container.add(textField);

  const hint = new TextRenderable(renderer, {
    id: "hint",
    content: "Press Ctrl+C to exit | Ctrl+W to delete word backward | Enter to submit",
    fg: "#565f89",
    attributes: TextAttributes.DIM,
  });
  container.add(hint);

  const valueDisplay = new TextRenderable(renderer, {
    id: "value-display",
    content: "Current value: ",
    fg: "#9ece6a",
  });
  container.add(valueDisplay);

  textField.on(InputRenderableEvents.INPUT, (value) => {
    valueDisplay.content = `Current value: ${value || "(empty)"}`;
  });

  renderer.root.add(container);
  textField.focus();

  renderer.start();
}

main();
