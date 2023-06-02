import { ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { ReviewCodePanel } from "../panels/ReviewCodePanel";
import { reviewInStream } from "../utilities/gptHelper";

const explainCodeHandler = (context: ExtensionContext) => {
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

export default explainCodeHandler;
