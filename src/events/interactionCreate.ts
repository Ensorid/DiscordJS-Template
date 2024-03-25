import { Events } from "discord.js";
import { logger } from "../utils/logger";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      await interaction.reply({
        content: `This command is no longer available! Please contact an administrator to update the command list.`,
        ephemeral: true,
      });
      return;
    }

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
