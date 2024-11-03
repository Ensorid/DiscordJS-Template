import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! and shows the ping.'),
	async execute(interaction: ChatInputCommandInteraction) {
		const start = Date.now();
		await interaction.reply({ content: '🏓 Latence :  ', ephemeral: true});
		const ping = Date.now() - start;
		await interaction.editReply(`🏓 Latence : ${ping} ms`);
	},
};
