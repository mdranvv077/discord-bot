const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Desconecta el bot del canal de voz'),

    async execute(interaction, client) {
        const queueData = client.musicQueues.get(interaction.guildId);

        // Verificar si el bot está conectado
        if (!queueData || !queueData.connection) {
            return await interaction.reply({
                content: '❌ El bot no está conectado a ningún canal de voz.',
                flags: 64
            });
        }

        try {
            // Detener la música si está reproduciéndose
            if (queueData.player) {
                queueData.player.stop();
            }

            // Desconectar
            queueData.connection.destroy();

            // Limpiar la cola
            client.musicQueues.delete(interaction.guildId);

            await interaction.reply({
                content: '👋 El bot se ha desconectado del canal de voz.'
            });
        } catch (error) {
            console.error('❌ Error al desconectar:', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al desconectar.',
                flags: 64
            });
        }
    }
};
