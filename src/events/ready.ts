import { Events } from "discord.js";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: any) {
    logger.info(`Logged in as ${client.user.tag}`);

    if (!fs.existsSync(path.join(__dirname, "../../logs"))) {
      fs.mkdirSync(path.join(__dirname, "../../logs"));
    }
  },
};
