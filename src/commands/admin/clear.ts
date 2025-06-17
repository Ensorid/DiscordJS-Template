import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import { level, log } from "../../utilities/logger";

module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName("clear")
		.setNameLocalizations({
			fr: "effacer",
		})
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
				.setDescription("Amount of message(s) to delete above")
				.setDescriptionLocalizations({
					fr: "Quantité de message(s) à effacer au dessus",
				})
				.setRequired(true)
				.setMaxValue(100))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction: ChatInputCommandInteraction) {
		const amount = interaction.options.getInteger("amount") || 0;

		await interaction.channel?.messages
			.fetch({ limit: amount })
			.then(messages => {
				messages.forEach(message => message.delete().catch(() => log(`Error deleting message ${message.id}:`, level.ERROR)));

				const locales: { [key: string]: string } = {
					"fr": `${messages.size < 1 ? "Aucun" : messages.size} message${messages.size > 1 ? "s" : ""} ${messages.size > 1 ? "ont" : "a"} été supprimé${messages.size > 1 ? "s" : ""}`,
				};

				interaction.reply({ content: locales[interaction.locale] ?? `${messages.size < 1 ? "No" : messages.size} message${messages.size > 1 ? "s" : ""} ${messages.size > 1 ? "have" : "has"} been deleted`, flags: MessageFlags.Ephemeral });
			});
	},
};