import { commands, ExtensionContext } from "vscode";
import reviewCodeHandler from "./handler/reviewCode";

export function activate(context: ExtensionContext) {
  const showReviewCodePanelCommand = commands.registerCommand(
    "stiger-vs-gpt.showReviewCodePanel",
    () => {
      reviewCodeHandler(context);
    }
  );

  // Add command to the extension context
  context.subscriptions.push(showReviewCodePanelCommand);
}
