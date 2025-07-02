import path from "path";
import fs from "fs";
import { SlashCommandBuilder, Locale } from "discord.js";

interface CommandInfo {
    command: string
	name: string;
	description: string;
}

export function getCommandsList(userLocale: string): CommandInfo[] {
	const commandsDir = path.join(__dirname, "..", "commands");
	const commands: CommandInfo[] = [];

	const locale = userLocale as Locale;

	function loadCommandsFromDirectory(dir: string) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				loadCommandsFromDirectory(fullPath);
			} else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
				try {
					const commandModule = require(fullPath);
					const data = commandModule?.data;

					if (data instanceof SlashCommandBuilder) {
						const json = data.toJSON();

						const command = json.name;
						const name = json.name_localizations?.[locale] ?? json.name;
						const description = json.description_localizations?.[locale] ?? json.description;

						commands.push({ command, name, description });
					}
				} catch (error) {
					console.error(`Erreur lors du chargement de la commande depuis ${fullPath}`, error);
				}
			}
		}
	}

	loadCommandsFromDirectory(commandsDir);
	return commands;
}
