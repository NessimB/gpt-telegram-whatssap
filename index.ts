import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage }  from "openai"

import config from './config';
import { type AxiosResponse } from 'axios';

dotenv.config()



const configuration = new Configuration({
  apiKey: config.gptkey,
});

const openai = new OpenAIApi(configuration);
const ram  : Record<number, ChatCompletionRequestMessage[]> = {}


const chat = async (payload : ChatCompletionRequestMessage[]) : Promise<AxiosResponse> => {
console.log("🚀 ~ file: index.ts:20 ~ chat ~ payload:", payload)

 return openai.createChatCompletion({
    model :"gpt-3.5-turbo",
    messages: payload
    })

}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.botToken, {polling: true});




bot.on('message',  (msg) => {
  const chatId = msg.chat.id;
 
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  ram[chatId] = [...(ram[chatId] || []), {"role": "user", "content": msg.text}]

    chat(ram[chatId]).then(async (res) => {

    ram[chatId].push(res.data.choices[0].message)

    // send a message to the chat acknowledging receipt of their message
    await bot.sendMessage(chatId, res.data.choices[0].message.content);
  }).catch(err => {
    console.error(err)
  }
    )

  
});

// main()


