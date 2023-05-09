import { commands, ExtensionContext } from "vscode";
import { ReviewCodePanel } from "./panels/ReviewCodePanel";
import * as vscode from "vscode";
import { review } from "./utilities/gptHelper";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showReviewCodePanelCommand = commands.registerCommand("stiger-vs-gpt.showReviewCodePanel", () => {
    ReviewCodePanel.render(context.extensionUri);

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const selection = editor.document.getText(editor.selection);

    ReviewCodePanel.postMessage({
      command: "codeblock",
      content: selection
    });

    review(selection).then((result: string) => {
      ReviewCodePanel.postMessage({
        command: "optimize",
        content: result
      });
    });
  });

  // Add command to the extension context
  context.subscriptions.push(showReviewCodePanelCommand);
}
