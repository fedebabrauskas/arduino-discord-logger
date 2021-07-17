require("dotenv").config();

const { Client } = require("discord.js");
const { createConnection } = require("./utils/serialPort");
const { cutText } = require("./utils/cutText");

const client = new Client();

let serialPort;

client.on("message", async (message) => {
    if (!serialPort) return;

    try {
        const json = JSON.stringify({
            username: cutText(message.author.username, 13),
            message: cutText(message.content, 13),
        });
        await serialPort.writeMessage(json);
    } catch (error) {
        console.error(error);
    }
});

client.on("ready", async () => {
    try {
        console.log("Client is ready!");
        serialPort = await createConnection();
        console.log("Connected to serial port!");
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
