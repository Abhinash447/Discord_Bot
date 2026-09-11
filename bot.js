require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { customAlphabet } = require('nanoid');

const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

const URL = require('./model/url');
const { connectToMongoDB } = require("./connect");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('create')) {
    const originalUrl = message.content.slice(6).trim();

    if (!originalUrl) {
      return message.reply("Please provide a URL");
    }

    try {
      const shortId = generateId();

      await URL.create({
        shortId,
        originalUrl
      });

      const shortUrl = `http://localhost:8090/${shortId}`;

      return message.reply(
        `✅ Short URL created!\n🔗 [Click here](http://localhost:8090/${shortId})`
      );
    } catch (error) {
      console.log(error);
      return message.reply("Failed to create short URL");
    }
  }

  message.reply({
    content: "Hii from bot"
  })
});

client.on('interactionCreate', interaction => {
  interaction.reply("Pong!!");
});

connectToMongoDB(process.env.mongo_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    client.login(process.env.DISCORD_TOKEN);
  })
  .catch((err) => {
    console.log("MongoDb connection failed:", err);
  })


