const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildConfig, disableGuildConfig } = require('./welcomeStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Activa o desactiva el sistema de bienvenida y despedida.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('accion')
                .setDescription('Elige si activar o desactivar el sistema.')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'on' },
                    { name: 'off', value: 'off' }
                )
        )
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviarán los mensajes.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const accion = interaction.options.getString('accion');
        const canal = interaction.options.getChannel('canal');

        if (accion === 'on') {
            if (!canal) {
                return interaction.reply({ content: 'Debes mencionar el canal donde se enviarán los mensajes.', ephemeral: true });
            }

            setGuildConfig(guild.id, {
                enabled: true,
                channelId: canal.id
            });

            return interaction.reply({ content: `Sistema de bienvenidas y despedidas activado en ${canal}.`, ephemeral: true });
        }

        if (accion === 'off') {
            const config = disableGuildConfig(guild.id);
            if (!config) {
                return interaction.reply({ content: 'El sistema ya está desactivado o nunca se configuró.', ephemeral: true });
            }

            return interaction.reply({ content: 'Sistema de bienvenidas y despedidas desactivado.', ephemeral: true });
        }

        return interaction.reply({ content: 'Acción desconocida.', ephemeral: true });
    }
};
