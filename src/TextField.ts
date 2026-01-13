import { InputRenderable, type KeyEvent, type InputRenderableOptions, type RenderContext } from "@opentui/core";

/**
 * Configuration options for TextField component
 */
export interface TextFieldOptions extends Omit<InputRenderableOptions, 'onKeyDown'> {
  /**
   * Enable Ctrl+W to delete word backward (default: true)
   */
  enableCtrlW?: boolean;
  
  /**
   * Optional handler for key down events (will be called after Ctrl+W handling)
   */
  onKeyDown?: ((key: KeyEvent) => boolean | void) | undefined;
}

/**
 * TextField - A customizable text input component with Ctrl+W support
 *
 * Extends InputRenderable to provide:
 * - Ctrl+W: Delete word backward from cursor position
 * - All standard InputRenderable features (placeholder, focus states, etc.)
 *
 * @example
 * ```typescript
 * const textField = new TextField(renderer, {
 *   placeholder: "Enter text...",
 *   width: 40,
 *   enableCtrlW: true,
 * });
 * ```
 */
export class TextField extends InputRenderable {
  private enableCtrlW: boolean;
  private userOnKeyDown?: ((key: KeyEvent) => boolean | void) | undefined;

  constructor(ctx: RenderContext, options: TextFieldOptions = {}) {
    // Store user's onKeyDown before calling super
    const userHandler = options.onKeyDown;
    
    super(ctx, options);
    
    this.enableCtrlW = options.enableCtrlW ?? true;
    this.userOnKeyDown = userHandler;
    this.setupCtrlWHandler();
  }

  private setupCtrlWHandler(): void {
    // Set up our own handler that chains to user's handler
    this.onKeyDown = (key: KeyEvent): boolean | void => {
      // First, check if Ctrl+W should be handled
      if (this.enableCtrlW && key.ctrl && key.name === "w") {
        key.preventDefault();
        this.deleteWordBackward();
        return true;
      }

      // Then call user's handler if provided
      if (this.userOnKeyDown) {
        return this.userOnKeyDown(key);
      }
    };
  }

  /**
   * Delete word backward from cursor position
   * Removes the word immediately preceding the cursor
   * 
   * Algorithm:
   * 1. Takes text before cursor
   * 2. Uses regex to find the last word and any trailing whitespace: /(\S+)\s*$/
   * 3. Deletes from the start of the match to cursor position
   */
  private deleteWordBackward(): void {
    const currentValue = this.value;
    const cursorPos = this.cursorPosition;

    // Nothing to delete if at start or empty
    if (cursorPos === 0 || currentValue.length === 0) {
      return;
    }

    const beforeCursor = currentValue.substring(0, cursorPos);
    const afterCursor = currentValue.substring(cursorPos);

    // Match last word (non-whitespace) and any trailing whitespace
    // Example: "hello world  " -> matches "world  "
    const match = beforeCursor.match(/(\S+)\s*$/);

    if (match && match.index !== undefined) {
      const wordToDelete = match[0];
      const deleteStartIndex = match.index;

      // Construct new value without the matched word
      const newValue = beforeCursor.substring(0, deleteStartIndex) + afterCursor;
      const newCursorPos = Math.max(0, cursorPos - wordToDelete.length);

      this.value = newValue;
      this.cursorPosition = newCursorPos;
    }
  }
}
