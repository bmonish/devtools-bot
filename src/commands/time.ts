import { CacheType, Interaction } from "discord.js";
import moment from "moment-timezone";

const CURRENT_TIME_IN_MILLIS = "CURRENT_TIME_IN_MILLIS";

export const timeCommand = {
  name: "time",
  description: "Tools for time",
  options: [
    {
      name: "operation",
      description: "The operation to perform",
      required: true,
      type: 3,
      choices: [
        { name: "Current time in millis", value: CURRENT_TIME_IN_MILLIS },
      ],
    },
  ],

  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { options } = interaction;

    const operationOption = options.get("operation");
    if (operationOption) {
      const operation = operationOption.value;

      switch (operation) {
        case CURRENT_TIME_IN_MILLIS: {
          await interaction.reply(moment().valueOf().toString());
          break;
        }
      }
    }
  },
};
