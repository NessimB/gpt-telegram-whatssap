const config : { botToken: string; gptkey: string; ici : true} = {
    botToken : process.env.BOT_TOKEN,
    gptkey : process.env.OPENAI_API_KEY,
    ici : true
} 

export default config