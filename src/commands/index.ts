import { base64command } from "./base64";

const commands = [base64command];

const botCommandsMap: { [key: string]: any } = {};

commands.forEach((command) => {
  botCommandsMap[command.name] = command;
});

export default commands;
export { botCommandsMap };
