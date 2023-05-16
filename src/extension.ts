import { commands, ExtensionContext } from "vscode";
import { ReviewCodePanel } from "./panels/ReviewCodePanel";
import * as vscode from "vscode";
import { review, reviewInStream } from "./utilities/gptHelper";

export function activate(context: ExtensionContext) {
  const showReviewCodePanelCommand = commands.registerCommand(
    "stiger-vs-gpt.showReviewCodePanel",
    () => {
      ReviewCodePanel.render(context.extensionUri);

      ReviewCodePanel.postMessage({
        command: "show-loading",
        content: true,
      });

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const selection = editor.document.getText(editor.selection);
      const { fileName, uri } = editor.document;

      ReviewCodePanel.postMessage({
        command: "codeblock",
        content: { selection, fileName, uri },
      });

      const postMessage = (content: string) => {
        ReviewCodePanel.postMessage({
          command: "optimize-in-stream",
          content,
        });
      };

      reviewInStream(selection, postMessage, () => {
        ReviewCodePanel.postMessage({
          command: "show-loading",
          content: false,
        });
      });
    }
  );

  // Add command to the extension context
  context.subscriptions.push(showReviewCodePanelCommand);
}
