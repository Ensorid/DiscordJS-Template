import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/logger";

export function getCommands() {
  const commands = [];
  const foldersPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        logger.error(
          `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  return commands;
}
