import path from "path";
import fs from "fs";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { initDatabase } from "./database";
import { log, level } from "./utilities/logger";

initDatabase(process.env.DB_TYPE as "json" | "sqlite");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>;
		cooldowns: Collection<any, any>;
    }
}

client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
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
			log(`Succesfully loaded command ${command.data.name}`, level.DEBUG);
		} else {
			log(`Unable to load command at ${filePath}. Property "data" or "execute" is missing.`, level.WARN);
		}
	}
}

// Load events
function loadEvents(eventDir: string) {
	const eventFile = fs.readdirSync(eventDir).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

	for (const file of eventFile) {
		const filePath = path.join(eventDir, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
			log(`Succesfully loaded event ${event.name}`, level.DEBUG);
		} else {
			client.on(event.name, (...args) => event.execute(...args));
			log(`Succesfully loaded event ${event.name}`, level.DEBUG);
		}

	}
}

const baseEventsPath = path.join(__dirname, "events");

const botEventsPath = path.join(baseEventsPath, "bot");
if (fs.existsSync(botEventsPath)) {
	loadEvents(botEventsPath);
}

loadEvents(baseEventsPath);

// Login the bot
client.login(process.env.TOKEN).catch(console.error);