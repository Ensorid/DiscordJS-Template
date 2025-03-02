import { Events, Client, ActivityType } from "discord.js";
import { log, level } from "../utilities/logger";
import { syncSettings } from "../utilities/syncSettings";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		// Set the bot's activity
		client.user?.setPresence({
			activities: [{ name: "Bot in devlopment", type: ActivityType.Custom }],
			status: "idle",
		  });
		
		// Sync settings with all guild
		log(`Starting synchronisation`, level.DEBUG);
		client.guilds.cache.forEach((guild) => { syncSettings(guild.id); });
		log(`Synchronisation complete`, level.DEBUG);

		// Log that the bot is ready
		log(`Ready! Logged in as ${client.user?.tag}`, level.DEBUG);
	},
};
