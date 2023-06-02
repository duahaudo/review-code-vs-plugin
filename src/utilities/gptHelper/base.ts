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

const prepend = "Answer should be embedded in Slack Markup. ";
export const createMessage = (msg: string) => ({ role: "user", content: `${prepend} ${msg}` });

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
