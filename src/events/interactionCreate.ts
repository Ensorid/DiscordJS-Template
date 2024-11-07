import { Collection, Events } from 'discord.js';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
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
					fr: `Veuillez patienter, vous êtes en attente pour la commmande \`${command.data.name}\`. Vous pourrez l\'utiliser <t:${expiredTimestamp}:R>.`
				}

				return interaction.reply({ content: locales[interaction.locale] ?? `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
			}
		}
	
		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);

			const locales: { [key: string]: string } = {
				fr: `Une erreur s'\est produite durant l'execution de cette commande !`
			}

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: locales[interaction.locale] ?? 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: locales[interaction.locale] ?? 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};
