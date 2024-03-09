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
};
