import { base64command } from "./base64";
import { charCommand } from "./char";
import { generateCommand } from "./generate";
import { jsonCommand } from "./json";
import { timeCommand } from "./time";

const commands = [
  base64command,
  charCommand,
  generateCommand,
  jsonCommand,
  timeCommand,
];

const botCommandsMap: { [key: string]: any } = {};

commands.forEach((command) => {
  botCommandsMap[command.name] = command;
});

export default commands;
export { botCommandsMap };
