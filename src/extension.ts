import { commands, ExtensionContext } from "vscode";
import { ReviewCodePanel } from "./panels/ReviewCodePanel";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showReviewCodePanelCommand = commands.registerCommand("stiger-vs-gpt.showReviewCodePanel", () => {

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const selection = editor.document.getText(editor.selection);

    ReviewCodePanel.render(context.extensionUri, selection || "");
  });

  // Add command to the extension context
  context.subscriptions.push(showReviewCodePanelCommand);
}
