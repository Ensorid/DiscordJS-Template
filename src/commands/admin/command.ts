import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js";

import { disableCommand, enableCommand } from "../../database/modules/commands";
import { getCommandsList } from "../../utilities/commands";

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName("command")
		.setNameLocalizations({
			fr: "commande",
		})
		.setDescription("Enable or disable a command for this server.")
		.setDescriptionLocalizations({
			fr: "Active ou désative une commande pour ce serveur.",
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(sub =>
			sub
				.setName("enable")
				.setNameLocalizations({
					fr: "activer",
				})
				.setDescription("Enable a command")
				.setDescriptionLocalizations({
					fr: "Activer une commande",
				})
				.addStringOption(option =>
					option
						.setName("command")
						.setNameLocalizations({
							fr: "commande",
						})
						.setDescription("Name of the command to enable")
						.setDescriptionLocalizations({
							fr: "Nom de la commande à activer",
						})
						.setRequired(true),
				),
		)
		.addSubcommand(sub =>
			sub
				.setName("disable")
				.setNameLocalizations({
					fr: "désactiver",
				})
				.setDescription("Disable a command")
				.setDescriptionLocalizations({
					fr: "Désactiver une commande",
				})
				.addStringOption(option =>
					option
						.setName("command")
						.setNameLocalizations({
							fr: "commande",
						})
						.setDescription("Name of the command to disable")
						.setDescriptionLocalizations({
							fr: "Nom de la commande à désactiver",
						})
						.setRequired(true),
				),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		const commandName = interaction.options.getString("command", true);
		const guildId = interaction.guild?.id;

		if (!guildId) {

			const locales: { [key: string]: string } = {
				"fr": "Cette commande est uniquement disponible sur un serveur.",
			};

			return interaction.reply({
				content: locales[interaction.locale] ?? "This command is only available in a server.",
				flags: MessageFlags.Ephemeral,
			});

		}

		const commands = getCommandsList(interaction.locale);
		const commandNameLower = commandName.toLowerCase();

		const commandObj = commands.find(obj =>
			obj.name.toLowerCase() === commandNameLower ||
		obj.command.toLowerCase() === commandNameLower,
		);

		if (!commandObj) {
			const locales: { [key: string]: string } = {
				"fr": `❌ La commande \`${commandName}\` n'existe pas.`,
			};

			return interaction.reply({
				content: locales[interaction.locale] ?? `❌ The command \`${commandName}\` does not exist.`,
				flags: MessageFlags.Ephemeral,
			});
		}

		const realCommand = commandObj.command;


		if (subcommand === "enable") {
			await enableCommand(guildId, realCommand);

			const locales: { [key: string]: string } = {
				"fr": `✅ La commande \`${realCommand}\` est maintenant activée.`,
			};

			return interaction.reply({
				content: locales[interaction.locale] ?? `✅ The command \`${realCommand}\` his now enabled.`,
				flags: MessageFlags.Ephemeral,
			});

		}

		if (subcommand === "disable") {
			await disableCommand(guildId, realCommand);

			const locales: { [key: string]: string } = {
				"fr": `🚫 La commande \`${realCommand}\` est maintenant désactivée.`,
			};

			return interaction.reply({
				content: locales[interaction.locale] ?? `🚫 The command \`${realCommand}\` his now disabled.`,
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
