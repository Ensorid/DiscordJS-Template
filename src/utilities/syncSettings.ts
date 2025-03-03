import { log, level } from "../utilities/logger";
import fs from "fs";
import path from "path";

/**
 * Synchronizes server settings with default settings, ensuring all options exist
 * @param guildId The Discord server/guild ID
 */
export function syncSettings(guildId: string): void {
	const settingsDir = path.join(__dirname, "../../settings");
	const defaultSettingsPath = path.join(settingsDir, "default.json");
	const serverSettingsPath = path.join(settingsDir, `${guildId}.json`);

	const defaultSettings = JSON.parse(fs.readFileSync(defaultSettingsPath, "utf-8"));

	if (!fs.existsSync(serverSettingsPath)) {
		fs.writeFileSync(serverSettingsPath, JSON.stringify(defaultSettings, null, 4));
		log(`Settings file created for ${guildId}`, level.DEBUG);
		return;
	}

	const serverSettings = JSON.parse(fs.readFileSync(serverSettingsPath, "utf-8"));

	// Sychronize server settings with default settings
	function mergeSettings(target: any, source: any): any {
		for (const key in source) {
			if (!Object.prototype.hasOwnProperty.call(target, key)) {
				target[key] = source[key];
			} else if (typeof source[key] === "object" && !Array.isArray(source[key])) {
				target[key] = mergeSettings(target[key] || {}, source[key]);
			}
		}
		return target;
	}

	const updatedSettings = mergeSettings(serverSettings, defaultSettings);

	fs.writeFileSync(serverSettingsPath, JSON.stringify(updatedSettings, null, 4));
}
