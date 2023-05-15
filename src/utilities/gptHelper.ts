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
const createMessage = (msg: string) => ({ role: "user", content: msg });

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

const askChatGPTStream = async (message: Message[]): Promise<Stream> => {
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

export const getStreamData = (stream: Stream): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];
    stream.on("data", (chunk) => {
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

const prepend = "Answer should be embedded in Slack Markup. ";

export const reviewInStream = async (
  code: string,
  postMessageFn: (x: string) => void,
  clear: () => void
) => {
  try {
    const response = await askChatGPTStream([
      createMessage(`${prepend} Optimize the following typescript code: ${code}`),
    ]);

    getStreamData(response)
      .then((text) => {
        const lines: string[] = text
          .toString()
          .split("\n")
          .filter((line: string) => line.trim() !== "");

        for (const line of lines) {
          if (line.includes("data: [DONE]")) {
            console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ .then ➡ line:`, line);
            //OpenAI sends [DONE] to say it's over
            clear();
            return;
          }

          const message = JSON.parse(line.substring(line.indexOf("{"), line.lastIndexOf("}") + 1));

          try {
            const { choices } = message;
            const { content } = choices[0].delta;

            if (content !== undefined) {
              postMessageFn(content);
            }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((err) => console.error(err));

    // const { content } = getContentFromResponse(response);
    // console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ review ➡ response:\n`, content);
    return "DONE";
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
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
