import { CacheType, EmbedBuilder, Interaction } from "discord.js";

export const base64command = {
  name: "base64",
  description: "Encode / Decode text to base64",
  options: [
    {
      name: "operation",
      description: "Whether to encode / decode the text",
      required: true,
      type: 3,
      choices: [
        { name: "Encode", value: "encode" },
        { name: "Decode", value: "decode" },
      ],
    },
    {
      name: "text",
      description: "The text to encode / decode",
      required: true,
      type: 3,
    },
  ],
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { options } = interaction;

    const operationOption = options.get("operation");
    const textOption = options.get("text");
    if (operationOption && textOption) {
      const operation = operationOption.value as string;
      const text = textOption.value as string;

      let result = "";
      const embed = new EmbedBuilder().setTitle("Base64");

      if (operation === "decode") {
        embed.setColor("Green");
        embed.setDescription("Given base64 text decoded to utf-8");
        embed.setURL("https://www.base64decode.org/");
        result = Buffer.from(text, "base64").toString("utf-8");
      } else {
        embed.setColor("Blue");
        embed.setDescription("Given text encoded to base64");
        embed.setURL("https://www.base64encode.org/");
        result = Buffer.from(text).toString("base64");
      }

      embed.addFields([
        { name: "Input", value: text, inline: true },
        { name: "Output", value: result, inline: true },
      ]);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
