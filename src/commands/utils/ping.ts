import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with the ping.")
		.setDescriptionLocalizations({
			fr: "Répond avec le ping.",
		}),
	async execute(interaction: ChatInputCommandInteraction) {
		const start = Date.now();
		await interaction.reply({ content: "🏓 Pong :  ", ephemeral: true });
		const ping = Date.now() - start;
		await interaction.editReply(`🏓 Pong : ${ping} ms`);
	},
};
