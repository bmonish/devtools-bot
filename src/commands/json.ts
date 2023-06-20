import { CacheType, EmbedBuilder, Interaction } from "discord.js";

const GET_BLOB_LINK = "GET_BLOB_LINK";

export const jsonCommand = {
  name: "json",
  description: "Tools for JSON",
  options: [
    {
      name: "operation",
      description: "The operation to perform",
      required: true,
      type: 3,
      choices: [{ name: "Get Blob Link", value: GET_BLOB_LINK }],
    },
    {
      name: "text",
      description: "The actual JSON",
      required: true,
      type: 3,
    },
    {
      name: "title",
      description: "The title of the embed",
      required: false,
      type: 3,
    },
  ],
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { options } = interaction;

    const operationOption = options.get("operation");
    const textOption = options.get("text");
    const titleOption = options.get("title");

    if (operationOption && textOption) {
      const operation = operationOption.value as string;
      const text = textOption.value as string;
      const title = titleOption?.value as string;

      switch (operation) {
        case GET_BLOB_LINK:
          {
            const response = await fetch(
              "https://www.jsonblob.com/api/jsonBlob",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: text,
              }
            );
            const headers = response.headers;
            const location = headers.get("location") || "";
            const url = location
              .replace("/api/jsonBlob", "")
              .replace("http:", "https:");

            if (title) {
              const embed = new EmbedBuilder()
                .setTitle("JSON Blob")
                .setDescription("JSON Blob created successfully!")
                .setFields([
                  { name: "Title", value: title },
                  {
                    name: "Link",
                    value: url,
                  },
                ])
                .setURL(url);
              await interaction.reply({ embeds: [embed] });
              return;
            }

            await interaction.reply(url);
          }
          break;
      }
    }
  },
};
