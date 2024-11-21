import { Events, Client, ActivityType } from "discord.js";
import { log, level } from "../utilities/logger";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		client.user?.setPresence({
			activities: [{ name: "Bot in devlopment", type: ActivityType.Custom }],
			status: "idle",
		  });
		  log(`Ready! Logged in as ${client.user?.tag}`, level.DEBUG);
	},
};
