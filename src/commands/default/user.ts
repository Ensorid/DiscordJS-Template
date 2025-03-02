import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Embed } from "discord.js";

module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName("user")
        .setNameLocalizations({
            fr: "utilisateur",
        })
        .setDescription("Show informations about a user")
        .setDescriptionLocalizations({
            fr: "Affiche les informations d'un utilisateur",
        })
        .addUserOption(option =>
			option
				.setName("user")
                .setNameLocalizations({
                    fr: "utilisateur",
                })
                .setDescription("User to show informations about")
                .setDescriptionLocalizations({
                    fr: "Utilisateur à afficher les informations",
                })
                .setRequired(false)),
	async execute(interaction: ChatInputCommandInteraction) {

        const targetUser = interaction.options.getUser("user") || interaction.user;

        const localeTitle: { [key: string]: string } = {
            "fr": "Informations sur",
        }

        const localeFooter: { [key: string]: string } = {
            "fr": "Demandé par",
        }

        const localeUser: { [key: string]: string } = {
            "fr": "Utilisateur",
        }

        const localeID: { [key: string]: string } = {
            "fr": "Identifiant",
        }

        const localeRoles: { [key: string]: string } = {
            "fr": "Rôles",
        }

        const localeAccountCreation: { [key: string]: string } = {
            "fr": "Création du compte", 
        }

        const localeJoinedAt: { [key: string]: string } = {
            "fr": "Rejoint le",
        }

        const localeNoBoost: { [key: string]: string } = {
            "fr": "Aucun boost",
        }

        const cardInfo = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: `${localeTitle[interaction.locale] ?? `Informations about`} ${targetUser.displayName}`, iconURL: targetUser.displayAvatarURL() })
            .addFields(
                { name: localeUser[interaction.locale] ?? "User", value: targetUser.toString(), inline: true},
                { name: localeID[interaction.locale] ?? "ID", value: targetUser.id, inline: true},
                { name: localeRoles[interaction.locale] ?? "Role", value: interaction.guild?.members.cache.get(targetUser.id)?.roles.cache.filter(role => role.name !== '@everyone').map(role => role).join(', ') ?? "No roles", inline: false},
                { name: localeAccountCreation[interaction.locale] ?? "Account creation", value: `<t:${Math.floor(targetUser.createdAt.getTime() / 1000)}:R>`, inline: true},
                { name: localeJoinedAt[interaction.locale] ?? "Joined at", value: `<t:${Math.floor((interaction.guild?.members.cache.get(targetUser.id)?.joinedTimestamp ?? 0) / 1000)}:R>`, inline: true},
                { name: "Boost", value: `${interaction.guild?.members.cache.get(targetUser.id)?.premiumSince ? `<t:${Math.floor(interaction.guild?.members.cache.get(targetUser.id)?.premiumSince?.getTime() ?? 0 / 1000)}:R>` : localeNoBoost[interaction.locale] ?? "No boost"}`, inline: true},
            )
            .setFooter({ text: `${localeFooter[interaction.locale] ?? "Asked by"} ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

            await interaction.reply({ embeds: [cardInfo] });
	},
};
