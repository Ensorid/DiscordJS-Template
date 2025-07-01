import { Collection, Events, MessageFlags } from "discord.js";
import { log, level } from "../../utilities/logger";
import { isCommandDisabled } from '../../database/modules/commands';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: any) {
		// Return if the interaction is not a command
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		// Check if the command exists
		if (!command) {
			log(`command ${interaction.commandName} not found for ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild.name} (${interaction.guild.id})`, level.WARN);

			const locales: { [key: string]: string } = {
				fr: `Aucune commande n'a été trouvée pour ${interaction.commandName}`,
			};

			interaction.reply({ content: locales[interaction.locale] ?? `No command was found for ${interaction.commandName}`, ephemeral: true });
			return;
		}

		// Check if the command is disabled in the guild
		const guildId = interaction.guild?.id;
		if (guildId && await isCommandDisabled(guildId, command.data.name)) {
			return interaction.reply({
				content: `❌ Cette commande est désactivée sur ce serveur.`,
				flags: MessageFlags.Ephemeral
			});
		}

		// Check if the user is in a cooldown
		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 0;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);

				const locales: { [key: string]: string } = {
					fr: `Veuillez patienter, vous êtes en attente pour la commmande \`${command.data.name}\`. Vous pourrez l'utiliser <t:${expiredTimestamp}:R>.`,
				};

				return interaction.reply({ content: locales[interaction.locale] ?? `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		// Run the command and catch any errors
		try {
			// Execute the command
			await command.execute(interaction);
			log(`command ${command.data.name} used by ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild.name} (${interaction.guild.id})`, level.INFO);
		} catch (error) {
			// Reply to the user with an error message and log the error
			log(error as string, level.ERROR);

			const locales: { [key: string]: string } = {
				fr: "Une erreur s'est produite durant l'execution de cette commande !",
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: locales[interaction.locale] ?? "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: locales[interaction.locale] ?? "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
			}
		}
	},
};
