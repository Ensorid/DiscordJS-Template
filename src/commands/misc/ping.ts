import { SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot latency!")
    .setDescriptionLocalizations({
      fr: "Obtenir la latence du bot !",
      de: "Erhalten Sie die Latenz des Bots!",
      it: "Ottenere la latenza dei bot!",
      "es-ES": "¡Consigue latencia bot!",
    }),

  async execute(interaction: any) {
    const ping = Date.now() - interaction.createdTimestamp;
    const locales: Record<string, string> = {
      fr: `\`🏓 Pong ! La latence du bot est de ${ping}ms.\``,
      de: `\`🏓 Pong! Die Latenzzeit des Bots beträgt ${ping}ms.\``,
      it: `\`🏓 Pong! La latenza del bot è di ${ping}ms.\``,
      "es-ES": `\`🏓 ¡Pong! La latencia del bot es de ${ping}ms.\``,
    };
    await interaction.reply({
      content:
        locales[interaction.locale] ??
        `\`🏓 Pong! The bot latency is ${ping}ms.\``,
      ephemeral: true,
    });
  },
};
