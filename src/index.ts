import { Client, Events } from "discord.js";
import botCommands, { botCommandsMap } from "./commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    const commands = await guild.commands.fetch();
    botCommands.forEach(async (command) => {
      const existingCommand = commands?.find((x) => x.name === command.name);

      // if (!existingCommand) {
      await guild.commands.create(command);
      // }
    });
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = botCommandsMap[commandName];

  if (!command) {
    interaction.reply("Command not found");
  }

  await command.execute(interaction);
});

client.login(process.env.BOT_TOKEN);
