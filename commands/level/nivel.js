const { SlashCommandBuilder } = require('discord.js');
const { getUserData, getGuildSettings } = require('./levelStore');
const { createLevelEmbed } = require('./levelBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nivel')
        .setDescription('Muestra tu nivel actual o el de otro usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario del que quieres ver el nivel (opcional, por defecto tú).')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild, user } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('usuario') || user;
        const member = interaction.options.getMember('usuario') || interaction.member;

        if (!member) {
            return interaction.reply({ content: 'No pude encontrar ese usuario en este servidor.', ephemeral: true });
        }

        const settings = getGuildSettings(guild.id);
        const userData = getUserData(guild.id, targetUser.id);
        const embed = createLevelEmbed(member, userData, settings.multiplier);

        return interaction.reply({ embeds: [embed] });
    }
};
