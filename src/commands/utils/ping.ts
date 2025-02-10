import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";

module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with the ping.")
		.setDescriptionLocalizations({
			fr: "Répond avec le ping.",
		}),
	async execute(interaction: ChatInputCommandInteraction) {
		const settingsPath = path.join(__dirname, `../../settings/${interaction.guildId}.json`);
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

		this.cooldown = settings.commands.ping.cooldown;

		const start = Date.now();
		await interaction.reply({ content: "🏓 Pong :  ", ephemeral: true });
		const ping = Date.now() - start;
		await interaction.editReply(`🏓 Pong : ${ping} ms`);
	},
};
