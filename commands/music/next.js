const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { reproducirSiguiente, formatDuracion } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('Salta a la siguiente canción en la cola'),

    async execute(interaction, client) {
        const queueData = client.musicQueues.get(interaction.guildId);

        // Verificar si hay una cola activa
        if (!queueData || !queueData.player) {
            return await interaction.reply({
                content: '❌ No hay música reproduciéndose en este servidor.',
                flags: 64
            });
        }

        // Verificar si hay canciones en la cola
        if (queueData.queue.length === 0) {
            return await interaction.reply({
                content: '❌ No hay más canciones en la cola.',
                flags: 64
            });
        }

        try {
            // Detener la canción actual
            queueData.queue.shift();

            if (queueData.queue.length === 0) {
                queueData.player.stop();
                queueData.playing = false;
                return await interaction.reply({
                    content: '⏭️ Última canción saltada. La cola está vacía.'
                });
            }

            // Reproducir la siguiente
            const nextSong = queueData.queue[0];
            await interaction.reply({
                content: `⏭️ Canción saltada.\n\n▶️ Reproduciendo ahora: **${nextSong.title}**\n⏱️ Duración: ${formatDuracion(nextSong.duration)}`
            });

            await reproducirSiguiente(interaction, client, queueData);
        } catch (error) {
            console.error('❌ Error al saltar canción:', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al saltar la canción.',
                flags: 64
            });
        }
    }
};
