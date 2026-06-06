const { SlashCommandBuilder } = require('discord.js');
const { getTopUsers, getGuildSettings } = require('./levelStore');
const { createTopLevelEmbed } = require('./levelBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topnivel')
        .setDescription('Muestra el top de usuarios con más niveles en el servidor.'),

    async execute(interaction) {
        const { guild } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const settings = getGuildSettings(guild.id);
        const topUsers = getTopUsers(guild.id, 10);
        const embed = createTopLevelEmbed(guild, topUsers, settings.multiplier);

        return interaction.reply({ embeds: [embed] });
    }
};
