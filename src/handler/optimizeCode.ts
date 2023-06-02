import { ExtensionContext } from "vscode";
import askChatGptHandler from "./base";

const reviewCodeHandler = (context: ExtensionContext) => {
  return askChatGptHandler(context, `Review and Optimize`);
};

export default reviewCodeHandler;
