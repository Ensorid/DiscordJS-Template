import "dotenv/config";
import { REST, Routes } from "discord.js";
import { logger } from "./logger";
import { getCommands } from "../handlers/getCommands";

const { publicBot } = require("../../config.json");

export function deployCommands() {
  const rest = new REST();

  rest.setToken(process.env.TOKEN as string);

  let data: any;

  (async () => {
    try {
      const commands = getCommands();
      logger.info(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      if (publicBot) {
        data = await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID as string),
          {
            body: commands,
          }
        );
      } else {
        data = await rest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID as string,
            process.env.GUILD_ID as string
          ),
          { body: commands }
        );
      }
      logger.info(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (err: any) {
      logger.error(err);
    }
  })();
}
