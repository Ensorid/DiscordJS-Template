import { Events, Client, ActivityType } from "discord.js";
import { log, level } from "../utilities/logger";
import { syncSettings } from "../utilities/syncSettings";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		client.user?.setPresence({
			activities: [{ name: "Bot in devlopment", type: ActivityType.Custom }],
			status: "idle",
		  });
		  log(`Starting synchronisation`, level.DEBUG);
		  client.guilds.cache.forEach((guild) => {
			syncSettings(guild.id);
		  });
		  log(`Synchronisation complete`, level.DEBUG);
		  log(`Ready! Logged in as ${client.user?.tag}`, level.DEBUG);
	},
};
