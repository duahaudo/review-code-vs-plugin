/* eslint-disable @typescript-eslint/naming-convention */

import { Stream } from "stream";
import * as vscode from "vscode";
const axios = require("axios");
const readline = require("readline");

enum COMMAND {
  newChat = "new",
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const openaiKey = vscode.workspace.getConfiguration("stiger-review").get<string>("openai-key");
const http = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    Authorization: `Bearer ${openaiKey}`,
  },
});

interface Message {
  role: string;
  content: string;
}

const prepend = "Answer must be embedded in Slack Markup. ";
export const createMessage = (msg: string, isSystem?: boolean) => ({
  role: isSystem ? "system" : "user",
  content: `${prepend} ${msg}`,
});

const getContentFromResponse = (response: any) => {
  const { choices } = response as any;
  const { content, role } = (choices as any)[0].message;
  return { content, role };
};

const createConversation = async (firstMessage: string) => {
  const history: any[] = [];

  const firstResponse = await askChatGPT([createMessage(firstMessage)]);
  history.push(getContentFromResponse(firstResponse));

  return async (message?: string) => {
    if (!message) {
      return history.map((item) => item.content);
    }
    history.push(createMessage(message));
    const response = await askChatGPT([...history]);
    history.push(getContentFromResponse(response));

    return response;
  };
};

const askChatGPT = async (message: Message[]) => {
  return new Promise(async (resolve) => {
    try {
      const request = {
        model: "gpt-3.5-turbo",
        stream: false,
        messages: message,
      };

      const { data } = await http.post("chat/completions", request);

      resolve(data);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  });
};

export const askChatGPTStream = async (message: Message[]): Promise<Stream> => {
  return new Promise(async (resolve) => {
    try {
      const request = {
        model: "gpt-3.5-turbo",
        stream: true,
        messages: message,
      };

      const response = await http.post("chat/completions", request, {
        timeout: 1000 * 60 * 2,
        responseType: "stream",
      });

      resolve(response.data as Stream);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  });
};

export const getStreamData = (stream: Stream, chunkHandler: (x: string) => void): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];
    stream.on("data", (chunk) => {
      chunkHandler(chunk.toString());
      data.push(chunk);
    });
    stream.on("end", () => {
      resolve(data);
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
};

export const pushStreamResponse = (data: string, messageCallback: (message: string) => void) => {
  const lines: string[] = data.split("\n").filter((line: string) => line.trim() !== "");
  try {
    for (const line of lines) {
      if (!line.includes("data: [DONE]")) {
        const message = JSON.parse(line.substring(line.indexOf("{"), line.lastIndexOf("}") + 1));
        const { choices } = message;
        const { content } = choices[0].delta;

        if (content) {
          messageCallback(content);
        }
      }
    }
  } catch (e) {
    console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ getStreamData ➡ line:`, data);
    console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ getStreamData ➡ e:`, e);
  }
};

export const review = async (code: string) => {
  try {
    const response = await askChatGPT([
      createMessage(`Optimize the following typescript code: ${code}`),
    ]);
    const { content } = getContentFromResponse(response);
    console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ review ➡ response:\n`, content);
    return content;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

export const askChatGPTStreamHandler = async (
  code: string,
  postMessageFn: (x: string) => void,
  clear: () => void
) => {
  try {
    const streamResponse = await askChatGPTStream([
      createMessage(
        `Your role as Code Reviewer is to assist in reviewing front-end code, focusing on projects that use ReactJS with TypeScript. When providing feedback, organize your response by grouping issues. For each issue, such as "Lack of TypeScript Type Annotations", follow a three-step structure: 1) Highlight the part of the code that fails this check, 2) Provide the main advice for improvement, and 3) Offer a fixed code example for that particular issue. This methodical approach helps in addressing performance optimization, readability, reusability, scalability, security, and adherence to best practices. Your feedback will be detailed and explanatory, aimed at enhancing both the code and the developer's comprehension. If additional context is needed or something is unclear, ask for clarification. This structured feedback process is designed to make it easier for developers to understand where improvements can be made and how to implement these changes effectively, leading to a more efficient and maintainable codebase.`,
        true
      ),
      createMessage(code),
    ]);

    getStreamData(streamResponse, (data: string) => pushStreamResponse(data, postMessageFn))
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
