import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the ping.'),
	async execute(interaction: ChatInputCommandInteraction) {
		const start = Date.now();
		await interaction.reply({ content: '🏓 Latency :  ', ephemeral: true});
		const ping = Date.now() - start;
		await interaction.editReply(`🏓 Latency : ${ping} ms`);
	},
};
