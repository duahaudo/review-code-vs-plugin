import { askChatGPTStream, createMessage, getStreamData } from "./base";

export const reviewInStream = async (
  code: string,
  postMessageFn: (x: string) => void,
  clear: () => void
) => {
  try {
    const streamResponse = await askChatGPTStream([
      createMessage(`Review and Optimize the following typescript code: ${code}`),
    ]);

    getStreamData(streamResponse, (data: string) => {
      const lines: string[] = data.split("\n").filter((line: string) => line.trim() !== "");
      try {
        for (const line of lines) {
          if (!line.includes("data: [DONE]")) {
            const message = JSON.parse(
              line.substring(line.indexOf("{"), line.lastIndexOf("}") + 1)
            );
            const { choices } = message;
            const { content } = choices[0].delta;

            if (content) {
              postMessageFn(content);
            }
          }
        }
      } catch (e) {
        console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ getStreamData ➡ line:`, data);
        console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ getStreamData ➡ e:`, e);
      }
    })
      .catch((err) => console.error(err))
      .finally(() => clear());
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

export const explainCodeInStream = async (
  code: string,
  postMessageFn: (x: string) => void,
  clear: () => void
) => {};
