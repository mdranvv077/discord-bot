const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildSettings, getGuildSettings } = require('./levelStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnivel')
        .setDescription('Establece el canal donde se anunciarán las subidas de nivel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviarán los anuncios de niveles.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { guild } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const canal = interaction.options.getChannel('canal');
        if (!canal) {
            return interaction.reply({ content: 'Debes mencionar un canal válido.', ephemeral: true });
        }

        const settings = getGuildSettings(guild.id);
        settings.channelId = canal.id;
        setGuildSettings(guild.id, settings);

        return interaction.reply({ content: `Canal de anuncios de niveles establecido en ${canal}.`, ephemeral: true });
    }
};
