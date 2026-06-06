const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Conecta el bot a tu canal de voz'),

    async execute(interaction, client) {
        // Verificar si el usuario está en un canal de voz
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({
                content: '❌ Debes estar en un canal de voz para usar este comando.',
                flags: 64
            });
        }

        try {
            // Conectar al canal de voz
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            // Guardar la conexión en el cliente
            if (!client.musicQueues.has(interaction.guildId)) {
                client.musicQueues.set(interaction.guildId, {
                    queue: [],
                    playing: false,
                    connection: connection,
                    resource: null
                });
            } else {
                const queueData = client.musicQueues.get(interaction.guildId);
                queueData.connection = connection;
            }

            await interaction.reply({
                content: `✅ Bot conectado a **${voiceChannel.name}**`
            });
        } catch (error) {
            console.error('❌ Error al conectar:', error);
            await interaction.reply({
                content: '❌ No pude conectarme al canal de voz.',
                ephemeral: true
            });flags: 64
        }
    }
};
