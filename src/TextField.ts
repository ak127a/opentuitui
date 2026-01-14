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
   * Enable paste support with Ctrl+V / Cmd+V (default: true)
   */
  enablePaste?: boolean;
  
  /**
   * Optional handler for key down events (will be called after Ctrl+W handling)
   */
  onKeyDown?: ((key: KeyEvent) => boolean | void) | undefined;
}

/**
 * TextField - A customizable text input component with Ctrl+W and paste support
 *
 * Extends InputRenderable to provide:
 * - Ctrl+W: Delete word backward from cursor position
 * - Ctrl+V / Cmd+V: Platform-agnostic paste from clipboard
 * - All standard InputRenderable features (placeholder, focus states, etc.)
 *
 * @example
 * ```typescript
 * const textField = new TextField(renderer, {
 *   placeholder: "Enter text...",
 *   width: 40,
 *   enableCtrlW: true,
 *   enablePaste: true,
 * });
 * ```
 */
export class TextField extends InputRenderable {
  private enableCtrlW: boolean;
  private enablePaste: boolean;
  private userOnKeyDown?: ((key: KeyEvent) => boolean | void) | undefined;

  constructor(ctx: RenderContext, options: TextFieldOptions = {}) {
    // Store user's onKeyDown before calling super
    const userHandler = options.onKeyDown;
    
    super(ctx, options);
    
    this.enableCtrlW = options.enableCtrlW ?? true;
    this.enablePaste = options.enablePaste ?? true;
    this.userOnKeyDown = userHandler;
    this.setupKeyHandler();
  }

  private setupKeyHandler(): void {
    // Set up our own handler that chains to user's handler
    this.onKeyDown = (key: KeyEvent): boolean | void => {
      // Check if Ctrl+W should be handled
      if (this.enableCtrlW && key.ctrl && key.name === "w") {
        key.preventDefault();
        this.deleteWordBackward();
        return true;
      }

      // Check if paste (Ctrl+V or Cmd+V) should be handled
      if (this.enablePaste && (key.ctrl || key.meta) && key.name === "v") {
        key.preventDefault();
        this.pasteFromClipboard();
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

  /**
   * Paste text from system clipboard at cursor position
   * Supports both Ctrl+V (Windows/Linux) and Cmd+V (macOS)
   * 
   * Uses platform-specific commands:
   * - macOS: pbpaste
   * - Linux (X11): xclip -selection clipboard -o
   * - Linux (Wayland): wl-paste
   * - Windows: powershell Get-Clipboard
   */
  private async pasteFromClipboard(): Promise<void> {
    try {
      const clipboardText = await this.readClipboard();
      
      if (!clipboardText) {
        return;
      }

      // Remove newlines and carriage returns for single-line input
      const sanitizedText = clipboardText.replace(/[\r\n]+/g, ' ');

      const currentValue = this.value;
      const cursorPos = this.cursorPosition;

      const beforeCursor = currentValue.substring(0, cursorPos);
      const afterCursor = currentValue.substring(cursorPos);

      const newValue = beforeCursor + sanitizedText + afterCursor;
      const newCursorPos = cursorPos + sanitizedText.length;

      this.value = newValue;
      this.cursorPosition = newCursorPos;
    } catch (error) {
      // Silently fail if clipboard access fails
      console.error('Failed to paste from clipboard:', error);
    }
  }

  /**
   * Read text from system clipboard using platform-specific commands
   */
  private async readClipboard(): Promise<string | null> {
    const platform = process.platform;

    try {
      if (platform === 'darwin') {
        // macOS
        return await this.execCommand('pbpaste');
      } else if (platform === 'win32') {
        // Windows
        return await this.execCommand('powershell.exe -command "Get-Clipboard"');
      } else {
        // Linux - try Wayland first, then X11
        try {
          return await this.execCommand('wl-paste');
        } catch {
          return await this.execCommand('xclip -selection clipboard -o');
        }
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute a shell command and return its output
   */
  private async execCommand(command: string): Promise<string> {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const parts = command.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);
      
      const process = spawn(cmd, args);
      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }
}
