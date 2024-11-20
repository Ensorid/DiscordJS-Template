import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clear an amount of message above")
		.setDescriptionLocalizations({
			fr: "Effacer un montant de message au dessus",
		})
		.addIntegerOption(option =>
			option
				.setName("amount")
				.setNameLocalizations({
					fr: "montant",
				})
				.setDescription("Amount of message to delete above")
				.setDescriptionLocalizations({
					fr: "Quantité de message à effacer au dessus",
				})
				.setRequired(true)
				.setMaxValue(100))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction: ChatInputCommandInteraction) {
		const amount = interaction.options.getInteger("amount") || 0;

		await interaction.channel?.messages
			.fetch({ limit: amount })
			.then(messages => {
				messages.forEach(message => message.delete().catch());

				const locales: { [key: string]: string } = {
					"fr": `${messages.size} messages ont été supprimés`,
				};

				interaction.reply({ content: locales[interaction.locale] ?? `Cleared ${messages.size} messages.`, ephemeral: true });
			});
	},
};