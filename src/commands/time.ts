import { CacheType, EmbedBuilder, Interaction } from "discord.js";
import moment from "moment-timezone";

const CURRENT_TIME_IN_MILLIS = "CURRENT_TIME_IN_MILLIS";
const CURRENT_TIME_IN_TIMESTAMP = "CURRENT_TIME_IN_TIMESTAMP";
const MILLIS_TO_TIMESTAMP = "MILLIS_TO_TIMESTAMP";

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
        { name: "Current time in timestamp", value: CURRENT_TIME_IN_TIMESTAMP },
        { name: "Millis to Timestamp", value: MILLIS_TO_TIMESTAMP },
      ],
    },
    {
      name: "value",
      description: "The value to convert",
      required: false,
      type: 4,
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

        case CURRENT_TIME_IN_TIMESTAMP: {
          const embed = new EmbedBuilder()
            .setTitle("Current Time")
            .setDescription("Current time in timestamp")
            .setFields([
              {
                name: "UTC",
                value: moment().utc().format("YYYY-MM-DD hh:mm:ss a"),
              },
              {
                name: "GMT+5:30",
                value: moment().utcOffset(330).format("YYYY-MM-DD hh:mm:ss a"),
              },
            ]);

          await interaction.reply({ embeds: [embed] });
          break;
        }

        case MILLIS_TO_TIMESTAMP: {
          const valueOption = options.get("value");
          if (!valueOption) {
            await interaction.reply("⚠️ Value is required for this operation");
            return;
          }

          const value = valueOption.value as number;
          const embed = new EmbedBuilder()
            .setTitle("Millis to Timestamp")
            .setDescription("Given millis converted to timestamp")
            .setFields([
              { name: "Input", value: value.toString() },
              {
                name: "UTC",
                value: moment(value).utc().format("YYYY-MM-DD hh:mm:ss a"),
              },
              {
                name: "GMT+5:30",
                value: moment(value)
                  .utcOffset(330)
                  .format("YYYY-MM-DD hh:mm:ss a"),
              },
            ]);
          await interaction.reply({ embeds: [embed] });
          break;
        }
      }
    }
  },
};
