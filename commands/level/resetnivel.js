const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getUserData, updateUserData } = require('./levelStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetnivel')
        .setDescription('Reinicia tu nivel y contador de mensajes a 0'),

    async execute(interaction) {
        const { guild, user } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const userData = getUserData(guild.id, user.id);

        // Si ya está en nivel 0, no hay nada que resetear
        if (userData.level === 0 && userData.messages === 0) {
            return interaction.reply({ content: 'Tu nivel ya está en 0. No hay nada que resetear.', ephemeral: true });
        }

        // Crear botones de confirmación
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_reset')
            .setLabel('Sí, resetear mi nivel')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_reset')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(confirmButton, cancelButton);

        const response = await interaction.reply({
            content: `⚠️ **¿Estás seguro de que quieres resetear tu nivel?**\n\nEsto reiniciará tu nivel a 0 y tu contador de mensajes a 0. Esta acción no se puede deshacer.\n\n**Tu nivel actual:** ${userData.level}\n**Mensajes contados:** ${userData.messages}`,
            components: [row],
            ephemeral: true
        });

        try {
            const confirmation = await response.awaitMessageComponent({ time: 30000 }); // 30 segundos timeout

            if (confirmation.customId === 'confirm_reset') {
                // Resetear los datos del usuario
                updateUserData(guild.id, user.id, { messages: 0, level: 0 });

                await confirmation.update({
                    content: '✅ **Tu nivel ha sido reseteado exitosamente.**\n\nAhora estás en nivel 0 con 0 mensajes contados.',
                    components: []
                });
            } else if (confirmation.customId === 'cancel_reset') {
                await confirmation.update({
                    content: '❌ **Operación cancelada.** Tu nivel no ha sido modificado.',
                    components: []
                });
            }
        } catch (error) {
            // Timeout o error
            await interaction.editReply({
                content: '⏰ **Tiempo agotado.** La operación ha sido cancelada.',
                components: []
            });
        }
    }
};
