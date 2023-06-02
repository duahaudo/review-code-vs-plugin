import { commands, ExtensionContext } from "vscode";
import reviewCodeHandler from "./handler/optimizeCode";
import explainCodeHandler from "./handler/explainCode";

export function activate(context: ExtensionContext) {
  const reviewCodeCommand = commands.registerCommand("stiger-vs-gpt.optimizeCode", () => {
    reviewCodeHandler(context);
  });

  const explainCodeCommand = commands.registerCommand("stiger-vs-gpt.explainCode", () => {
    explainCodeHandler(context);
  });

  // Add command to the extension context
  context.subscriptions.push(reviewCodeCommand);
  context.subscriptions.push(explainCodeCommand);
}
