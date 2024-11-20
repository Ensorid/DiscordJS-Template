import path from "path";
import fs from "fs";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { log, level } from "./utilities/logger";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

declare module "discord.js" {
    // eslint-disable-next-line no-shadow
    interface Client {
        commands: Collection<string, unknown>;
		cooldowns: Collection<unknown, unknown>;
    }
}

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			log(`command at ${filePath} is missing a required "data" or "execute" property.`, level.WARN);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN).catch(console.error);