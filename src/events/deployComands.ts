import { REST, Routes, Events, Client } from "discord.js";
import { log, level } from "../utilities/logger";
import fs from "fs";
import path from "path";
import "dotenv/config";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute() {
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
                    log(`Command at ${filePath} is missing a required "data" or "execute" property.`, level.WARN);
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
    },
};
