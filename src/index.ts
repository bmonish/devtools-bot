import { Client, Events } from "discord.js";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", async (c) => {
  console.log(`Logged in as ${c.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    const commands = await guild.commands.fetch();
    const base64Command = commands?.find(
      (command) => command.name === "base64"
    );
    if (!base64Command) {
      await guild.commands.create({
        name: "base64",
        description: "Encode text to base64",
        options: [
          {
            name: "text",
            description: "The text to encode",
            required: true,
            type: 3,
          },
        ],
      });
    }
  });
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.reply("Pong!");
  }

  if (message.content.startsWith("!base64")) {
    const text = message.content.split(" ").slice(1).join(" ");
    const encoded = Buffer.from(text).toString("base64");
    message.reply(encoded);
  }
});

// I want to listen to the base64 command registered above and reply with the encoded text
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "base64") {
    const textOption = options.get("text");
    if (textOption) {
      const text = textOption.value as string;
      const encoded = Buffer.from(text).toString("base64");
      interaction.reply(encoded);
    }
  }
});

client.login(
  "MTIyNjUzMDUxMzM4NTQyNzEwNQ.GUbaSW.T29CVbbog_AGJcCrKT2SW1yiTwXjmmHGicXd9Q"
);
