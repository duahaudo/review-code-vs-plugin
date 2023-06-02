import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { ReviewCodePanel } from "../panels/ReviewCodePanel";
import { askChatGPTStreamHandler } from "../utilities/gptHelper";

const askChatGptHandler = (context: ExtensionContext, prompt: string) => {
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

  askChatGPTStreamHandler(`${prompt} the following code: ${selection}`, postMessage, () => {
    ReviewCodePanel.postMessage({
      command: "show-loading",
      content: false,
    });
  });
};

export default askChatGptHandler;
