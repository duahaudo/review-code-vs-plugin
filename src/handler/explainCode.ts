import { ExtensionContext } from "vscode";
import askChatGptHandler from "./base";

const explainCodeHandler = (context: ExtensionContext) => {
  return askChatGptHandler(context, `Explain`);
};

export default explainCodeHandler;
