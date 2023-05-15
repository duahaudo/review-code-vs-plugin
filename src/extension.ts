import { commands, ExtensionContext } from "vscode";
import { ReviewCodePanel } from "./panels/ReviewCodePanel";
import * as vscode from "vscode";
import { review, reviewInStream } from "./utilities/gptHelper";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showReviewCodePanelCommand = commands.registerCommand(
    "stiger-vs-gpt.showReviewCodePanel",
    () => {
      ReviewCodePanel.render(context.extensionUri);

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const selection = editor.document.getText(editor.selection);

      ReviewCodePanel.postMessage({
        command: "codeblock",
        content: selection,
      });

      ReviewCodePanel.postMessage({
        command: "show-loading",
        content: true,
      });

      // review(selection).then((result: string) => {
      //   ReviewCodePanel.postMessage({
      //     command: "optimize",
      //     content: result
      //   });
      // });

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
