import { REST, Routes, Events, Client, ActivityType } from "discord.js";
import { log, level } from "../utilities/logger";
import { syncSettings } from "../utilities/syncSettings";
import fs from "fs";
import path from "path";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		// Sync settings with all guild
		log(`Starting synchronisation`, level.DEBUG);
		client.guilds.cache.forEach((guild) => { syncSettings(guild.id); });
		log(`Synchronisation complete`, level.DEBUG);

		// Deploying commands
		const commands: any[] = [];
        
        const foldersPath = path.join(__dirname, "../commands");
        const commandFolders = fs.readdirSync(foldersPath);
        
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ("data" in command && "execute" in command) {
                    commands.push(command.data.toJSON());
                } else {
                    log(`Unable to deploy command at ${filePath}. Property "data" or "execute" is missing.`, level.WARN);
                }
            }
        }
        
        const rest = new REST().setToken(process.env.TOKEN as string);
        
        (async () => {
            try {
                log(`Refreshing ${commands.length} application (/) commands.`, level.DEBUG);
        
                let data: any;
        
                    data = await rest.put(
                        Routes.applicationCommands(process.env.CLIENTID as string),
                        { body: commands },
                    );
        
                log(`Successfully reloaded ${Array.isArray(data) ? data.length : 0} application (/) commands.`, level.DEBUG);
            } catch (error) {
                log(error as string, level.ERROR);
            }
        })();

		// Set the bot's activity
		client.user?.setPresence({
			activities: [{ name: "Bot in devlopment", type: ActivityType.Custom }],
			status: "idle",
		});

		// Log that the bot is ready
		log(`Ready! Logged in as ${client.user?.tag}`, level.DEBUG);
	},
};
