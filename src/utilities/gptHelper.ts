/* eslint-disable @typescript-eslint/naming-convention */

require('dotenv/config');
const axios = require("axios");
const readline = require('readline');
const { Configuration, OpenAIApi } = require("openai");

enum COMMAND {
  newChat = 'new'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const http = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    Authorization: `Bearer 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`
  }
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Message {
  role: string
  content: string
}
const createMessage = (msg: string) => ({ "role": "user", "content": msg });

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
      return history.map(item => item.content);
    }
    history.push(createMessage(message));
    const response = await askChatGPT([...history]);
    history.push(getContentFromResponse(response));

    return response;
  };
};

const askChatGPT = async (message: Message[]) => {
  return new Promise(async resolve => {
    try {
      const request = {
        "model": "gpt-3.5-turbo",
        "stream": false,
        "messages": message
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

export const review = async (code: string) => {
  try {

    const response = await askChatGPT([createMessage(`Optimize the following typescript code: ${code}`)]);
    const { content } = getContentFromResponse(response);
    console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ review ➡ response:`, content);
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
