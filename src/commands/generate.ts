import { CacheType, Interaction } from "discord.js";
import { v4 as uuidV4 } from "uuid";
import crypto from "crypto";

const RANDOM_UUID = "RANDOM_UUID";
const SECRET_STRING = "SECRET_STRING";

export const generateCommand = {
  name: "generate",
  description: "Generate util values",
  options: [
    {
      name: "operation",
      description: "The type of value to generate",
      required: true,
      type: 3,
      choices: [
        { name: "Random UUID", value: RANDOM_UUID },
        { name: "Secret String", value: SECRET_STRING },
      ],
    },
    {
      name: "length",
      description: "The length of the secret string (default: 32)",
      required: false,
      type: 4,
    },
  ],

  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { options } = interaction;

    const operationOption = options.get("operation");
    if (operationOption) {
      const operation = operationOption.value as string;

      switch (operation) {
        case RANDOM_UUID: {
          await interaction.reply(uuidV4());
          break;
        }
        case SECRET_STRING: {
          const len = (options.get("length")?.value as number) || 32;
          await interaction.reply(crypto.randomBytes(len).toString("hex"));
          break;
        }
      }
    }
  },
};
