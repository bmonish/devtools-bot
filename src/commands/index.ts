import { base64command } from "./base64";
import { generateCommand } from "./generate";
import { jsonCommand } from "./json";

const commands = [base64command, generateCommand, jsonCommand];

const botCommandsMap: { [key: string]: any } = {};

commands.forEach((command) => {
  botCommandsMap[command.name] = command;
});

export default commands;
export { botCommandsMap };
