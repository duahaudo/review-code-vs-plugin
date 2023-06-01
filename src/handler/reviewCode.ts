import { ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { ReviewCodePanel } from "../panels/ReviewCodePanel";
import { review, reviewInStream } from "../utilities/gptHelper";

const reviewCodeHandler = (context: ExtensionContext) => {
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
};

export default reviewCodeHandler;
