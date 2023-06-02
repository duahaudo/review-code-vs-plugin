export { askChatGPTStreamHandler } from "./base";

// export const reviewInStream = async (
//   code: string,
//   postMessageFn: (x: string) => void,
//   clear: () => void
// ) => {
//   askChatGPTStreamHandler(
//     `Review and Optimize the following typescript code: ${code}`,
//     postMessageFn,
//     clear
//   );
// };

// export const explainCodeInStream = async (
//   code: string,
//   postMessageFn: (x: string) => void,
//   clear: () => void
// ) => {
//   askChatGPTStreamHandler(`Explain the following code: ${code}`, postMessageFn, clear);
// };
