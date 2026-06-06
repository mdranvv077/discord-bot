const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce un archivo de audio MP3 desde una URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL directa del archivo MP3 (ejemplo: https://ejemplo.com/cancion.mp3)')
                .setRequired(true)),

    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;

        // Verificar si el usuario está en un canal de voz
        if (!voiceChannel) {
            return await interaction.reply({
                content: '❌ Debes estar en un canal de voz para reproducir música.',
                flags: 64
            });
        }

        await interaction.deferReply();

        try {
            const url = interaction.options.getString('url');

            // Validar que sea una URL válida
            try {
                new URL(url);
            } catch (e) {
                return await interaction.editReply({ content: '❌ Por favor, proporciona una URL válida.' });
            }

            // Validar que sea un archivo MP3
            if (!url.toLowerCase().includes('.mp3')) {
                console.error('❌ [FORMATO INVÁLIDO]:', {
                    url: url,
                    razon: 'La URL no contiene extensión .mp3',
                    mensaje: 'Solo se aceptan archivos MP3'
                });
                return await interaction.editReply({ content: '❌ Solo se aceptan **archivos MP3**. Proporciona una URL que termine en `.mp3`' });
            }

            // Extraer nombre del archivo de la URL
            let songTitle = url.split('/').pop().replace('.mp3', '').replace(/%20/g, ' ');
            if (songTitle.length === 0) {
                songTitle = 'Canción sin nombre';
            }

            const song = {
                title: songTitle,
                url: url,
                duration: 0,
                requestedBy: interaction.user.username
            };

            console.log(`✅ [MP3 AÑADIDO] Canción agregada a la cola:`, {
                titulo: song.title,
                url: song.url,
                usuario: song.requestedBy
            });

            // Obtener o crear la cola del servidor
            let queueData = client.musicQueues.get(interaction.guildId);

            if (!queueData) {
                const { joinVoiceChannel } = require('@discordjs/voice');
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: true,
                    selfMute: false
                });

                queueData = {
                    queue: [],
                    playing: false,
                    connection: connection,
                    resource: null,
                    player: null
                };
                client.musicQueues.set(interaction.guildId, queueData);
            }

            // Agregar canción a la cola
            queueData.queue.push(song);

            // Si no está reproduciendo, empezar
            if (!queueData.playing) {
                await reproducirSiguiente(interaction, client, queueData);
            } else {
                await interaction.editReply({
                    content: `✅ Agregada a la cola (#${queueData.queue.length}):\n**${song.title}**`
                });
            }
        } catch (error) {
            console.error('❌ Error al procesar URL:', error);
            await interaction.editReply({ content: '❌ Ocurrió un error al procesar la URL.' });
        }
    }
};

// Función para reproducir la siguiente canción
async function reproducirSiguiente(interaction, client, queueData) {
    if (queueData.queue.length === 0) {
        queueData.playing = false;
        return;
    }

    const song = queueData.queue[0];
    queueData.playing = true;

    try {
        console.log(`▶️ [MP3 REPRODUCIENDO]`, {
            titulo: song.title,
            url: song.url,
            usuario: song.requestedBy
        });

        // Crear recurso de audio desde la URL MP3
        const resource = createAudioResource(song.url, {
            inlineVolume: true
        });

        // Crear reproductor si no existe
        if (!queueData.player) {
            queueData.player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause
                }
            });

            // Suscribir el reproductor a la conexión
            queueData.connection.subscribe(queueData.player);

            // Detectar cuando termina una canción
            queueData.player.on(AudioPlayerStatus.Idle, async () => {
                console.log(`⏹️ [MP3 FINALIZADO] Canción terminada: ${song.title}`);
                queueData.queue.shift();
                
                if (queueData.queue.length > 0) {
                    await reproducirSiguiente(interaction, client, queueData);
                } else {
                    queueData.playing = false;
                    console.log('📭 Cola vacía. Esperando nuevas canciones...');
                }
            });

            queueData.player.on('error', error => {
                console.error('❌ [ERROR DE REPRODUCCIÓN]:', {
                    titulo: song.title,
                    url: song.url,
                    mensaje: error.message,
                    tipo: error.constructor.name
                });
                
                if (error.message.includes('404')) {
                    console.warn('⚠️ [404] La URL no existe o no es accesible');
                } else if (error.message.includes('403')) {
                    console.warn('⚠️ [403] Acceso prohibido a la URL');
                }
                
                queueData.queue.shift();
                reproducirSiguiente(interaction, client, queueData);
            });
        }

        // Reproducir
        queueData.resource = resource;
        queueData.player.play(resource);

        await interaction.reply({
            content: `▶️ Reproduciendo: **${song.title}**\n👤 Solicitado por: ${song.requestedBy}`
        });
    } catch (error) {
        console.error('❌ [ERROR AL CREAR STREAM]:', {
            titulo: song.title,
            url: song.url,
            mensaje: error.message,
            tipo: error.constructor.name
        });
        
        if (error.message.includes('404')) {
            console.error('⚠️ [404] La URL del MP3 no existe o retorna 404');
        } else if (error.message.includes('403')) {
            console.error('⚠️ [403] Acceso prohibido. La URL está bloqueada');
        } else if (error.message.includes('timeout')) {
            console.error('⚠️ [TIMEOUT] La URL tardó demasiado en responder');
        }
        
        queueData.queue.shift();
        await reproducirSiguiente(interaction, client, queueData);
    }
}

// Función auxiliar para formatear duración
function formatDuracion(segundos) {
    if (!segundos || segundos === 0) return 'Duración desconocida';
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
}

module.exports.reproducirSiguiente = reproducirSiguiente;
module.exports.formatDuracion = formatDuracion;
