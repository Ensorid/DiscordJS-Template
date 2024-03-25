import { Events } from "discord.js";
import { logger } from "../utils/logger";
import { Collection } from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      await interaction.reply({
        content: `This command is no longer available. Please contact an administrator to update the command list.`,
        ephemeral: true,
      });
      return;
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for this command. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (err: any) {
      logger.error(err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
    logger.warn(
      `The user ${interaction.user.username} (${
        interaction.user.id
      }) used the ${interaction.commandName} command on the server ${
        interaction.guild ? interaction.guild.name : "Direct Message"
      } (${interaction.guild ? interaction.guild.id : "DM"}) on channel ${
        interaction.channel.name
      } (${interaction.channel.id})`
    );
  },
};
