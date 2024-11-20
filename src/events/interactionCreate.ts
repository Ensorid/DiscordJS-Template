import { Collection, Events } from "discord.js";
import { log, level } from "../utilities/logger";

module.exports = {
	name: Events.InteractionCreate,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async execute(interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			log(`command ${interaction.commandName} not found for ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild.name} (${interaction.guild.id})`, level.WARN);

			const locales: { [key: string]: string } = {
				fr: `Aucune commande n'a été trouvée pour ${interaction.commandName}`,
			};

			interaction.reply({ content: locales[interaction.locale] ?? `No command was found for ${interaction.commandName}`, ephemeral: true });
			return;
		}

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

				return interaction.reply({ content: locales[interaction.locale] ?? `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
			log(`command ${command.data.name} used by ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild.name} (${interaction.guild.id})`, level.INFO);
		} catch (error) {
			log(error as string, level.ERROR);

			const locales: { [key: string]: string } = {
				fr: "Une erreur s'est produite durant l'execution de cette commande !",
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: locales[interaction.locale] ?? "There was an error while executing this command!", ephemeral: true });
			} else {
				await interaction.reply({ content: locales[interaction.locale] ?? "There was an error while executing this command!", ephemeral: true });
			}
		}
	},
};
