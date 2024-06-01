import { CacheType, EmbedBuilder, Interaction } from "discord.js";

const COMPARE = "COMPARE";
const COUNT = "COUNT";

export const charCommand = {
  name: "text",
  description: "Tools to work with characters / words",
  options: [
    {
      name: "operation",
      description: "The type of operation to perform",
      required: true,
      type: 3,
      choices: [
        { name: "Count", value: COUNT },
        { name: "Compare", value: COMPARE },
      ],
    },
    {
      name: "text",
      description: "The text to operate on",
      required: true,
      type: 3,
    },
    {
      name: "text2",
      description: "The second text to operate on",
      required: false,
      type: 3,
    },
  ],

  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { options } = interaction;

    const operationOption = options.get("operation");
    if (operationOption) {
      const operation = operationOption.value as string;

      switch (operation) {
        case COUNT: {
          const text = options.get("text")?.value as string;
          const charCount = text.length;
          const wordCount = text.split(" ").length;

          const embed = new EmbedBuilder()
            .setTitle("Count")
            .setDescription("Character and word count")
            .setColor("Blue");

          embed.addFields([
            { name: "Input", value: text },
            { name: "Char Count", value: `${charCount}`, inline: true },
            { name: "Word Count", value: `${wordCount}`, inline: true },
          ]);

          await interaction.reply({ embeds: [embed] });
          break;
        }

        case COMPARE: {
          const text1 = options.get("text")?.value as string;
          const text2 = options.get("text2")?.value as string;

          if (!text2) {
            await interaction.reply(
              "⚠️ Please provide a second text to compare ⚠️"
            );
            return;
          }

          const embed = new EmbedBuilder()
            .setTitle("Compare")
            .setDescription("Comparison of two texts")
            .setColor("Green");

          const areEqual = text1 === text2;
          embed.addFields([
            { name: "Text 1", value: text1 },
            { name: "Text 2", value: text2 },
            { name: "Are Equal", value: areEqual ? "Yes" : "No" },
          ]);

          await interaction.reply({ embeds: [embed] });
          break;
        }
      }
    }
  },
};
