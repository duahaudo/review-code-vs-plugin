import { commands, ExtensionContext } from "vscode";
import reviewCodeHandler from "./handler/reviewCode";
import explainCodeHandler from "./handler/explainCode";

export function activate(context: ExtensionContext) {
  const reviewCodeCommand = commands.registerCommand("stiger-vs-gpt.reviewCode", () => {
    reviewCodeHandler(context);
  });

  const explainCodeCommand = commands.registerCommand("stiger-vs-gpt.explainCode", () => {
    explainCodeHandler(context);
  });

  // Add command to the extension context
  context.subscriptions.push(reviewCodeCommand);
  context.subscriptions.push(explainCodeCommand);
}
