const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatDuracion } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Muestra la lista de canciones en la cola'),

    async execute(interaction, client) {
        const queueData = client.musicQueues.get(interaction.guildId);

        // Verificar si hay una cola activa
        if (!queueData || queueData.queue.length === 0) {
            return await interaction.reply({
                content: '❌ No hay canciones en la cola.',
                flags: 64
            });
        }

        try {
            const queue = queueData.queue;
            let descripcion = '';

            // Mostrar canción actual
            const currentSong = queue[0];
            descripcion += `**▶️ Reproduciendo ahora:**\n`;
            descripcion += `1. **${currentSong.title}**\n`;
            descripcion += `   ⏱️ ${formatDuracion(currentSong.duration)} | 👤 ${currentSong.requestedBy}\n\n`;

            // Mostrar resto de la cola
            if (queue.length > 1) {
                descripcion += `**📋 Próximas canciones (${queue.length - 1}):**\n`;
                
                for (let i = 1; i < queue.length && i <= 10; i++) {
                    const song = queue[i];
                    descripcion += `${i + 1}. **${song.title}**\n`;
                    descripcion += `   ⏱️ ${formatDuracion(song.duration)} | 👤 ${song.requestedBy}\n`;
                }

                if (queue.length > 11) {
                    descripcion += `\n... y ${queue.length - 11} canciones más`;
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#FF0000') // Rojo como YouTube
                .setTitle('🎵 Cola de Reproducción')
                .setDescription(descripcion)
                .setFooter({ text: `Total: ${queue.length} canción(es)` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('❌ Error al mostrar cola:', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al mostrar la cola.',
                flags: 64
            });
        }
    }
};
