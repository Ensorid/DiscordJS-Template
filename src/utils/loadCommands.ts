import fs from "node:fs";
import path from "node:path";
import { Client, Collection } from "discord.js";
import { logger } from "./logger";

export function loadCommands(client: Client) {
  client.commands = new Collection();

  const foldersPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        logger.info(`The command ${command.data.name} has been loaded!`);
      } else {
        logger.error(
          `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}
