import { ExtensionContext } from "vscode";
import askChatGptHandler from "./base";

const reviewCodeHandler = (context: ExtensionContext) => {
  return askChatGptHandler(
    context,
    `Optimize (remove complexity, redundant complexity, recursive elimination, improve performance) and give explanation what is better`
  );
};

export default reviewCodeHandler;
