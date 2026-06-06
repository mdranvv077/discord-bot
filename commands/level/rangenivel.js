const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, setGuildSettings } = require('./levelStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rangenivel')
        .setDescription('Cambia el multiplicador para subir de nivel (1.5x a 5.0x).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addNumberOption(option =>
            option.setName('multiplicador')
                .setDescription('Nuevo multiplicador (mínimo 1.5, máximo 5.0).')
                .setRequired(true)
                .setMinValue(1.5)
                .setMaxValue(5.0)
        ),

    async execute(interaction) {
        const { guild } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const multiplier = interaction.options.getNumber('multiplicador');
        if (multiplier < 1.5 || multiplier > 5.0) {
            return interaction.reply({ content: 'El multiplicador debe estar entre 1.5 y 5.0.', ephemeral: true });
        }

        const settings = getGuildSettings(guild.id);
        settings.multiplier = multiplier;
        setGuildSettings(guild.id, settings);

        return interaction.reply({ content: `Multiplicador de niveles cambiado a x${multiplier}.`, ephemeral: true });
    }
};
