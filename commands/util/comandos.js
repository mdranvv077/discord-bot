const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comandos')
        .setDescription('Muestra la lista de todos los comandos disponibles'),

    async execute(interaction, client) {
        // Obtener todos los comandos disponibles
        const commands = client.commands;

        if (commands.size === 0) {
            return await interaction.reply({
                content: '❌ No hay comandos disponibles.',
                flags: 64
            });
        }

        // Crear un embed con todos los comandos
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📋 Lista de Comandos')
            .setDescription(`Total de comandos disponibles: **${commands.size}**`)
            .setThumbnail(client.user.avatarURL());

        // Definir mapa de categorías y sus emojis
        const categoriasInfo = {
            'util': { nombre: '🛠️ Utilidad', emoji: '🛠️' },
            'music': { nombre: '🎵 Música', emoji: '🎵' },
            'fun': { nombre: '🎉 Diversión', emoji: '🎉' },
            'admin': { nombre: '⚙️ Admin', emoji: '⚙️' },
            'welcome': { nombre: '👋 Bienvenidas', emoji: '👋' },
            'level': { nombre: '📊 Niveles', emoji: '📊' }
        };

        // Agrupar comandos por categoría
        const categorias = {};

        for (const [name, command] of commands) {
            const cmdData = command.data.toJSON();
            const nombre = cmdData.name;
            const descripcion = cmdData.description || 'Sin descripción';
            
            // Determinar la categoría por la ruta del archivo
            let categoria = 'util'; // Por defecto
            
            if (command.constructor.name === 'Object' && command.data) {
                // Intentar obtener la carpeta de la ruta si está disponible
                // Por ahora usaremos un mapeo simple por nombre o dejaremos que se detecte
                // Podemos hacer una búsqueda simple en client.commands para detectar patrones
            }
            
            // Mapeo automático basado en palabras clave del comando
            if (nombre.includes('play') || nombre.includes('next') || nombre.includes('connect') || 
                nombre.includes('leave') || nombre.includes('list')) {
                categoria = 'music';
            } else if (nombre.includes('kick') || nombre.includes('ban') || nombre.includes('mute') || 
                       nombre.includes('unmute') || nombre.includes('shutdown')) {
                categoria = 'admin';
            } else if (nombre.includes('meme') || nombre.includes('fuck')) {
                categoria = 'fun';
            } else if (nombre.includes('welcome') || nombre.includes('test')) {
                categoria = 'welcome';
            } else if (nombre.includes('nivel') || nombre.includes('setnivel') || nombre.includes('topnivel') || 
                       nombre.includes('rangenivel') || nombre.includes('resetnivel')) {
                categoria = 'level';
            }
            // El resto usa 'util' por defecto

            if (!categorias[categoria]) {
                categorias[categoria] = [];
            }

            categorias[categoria].push({
                nombre: nombre,
                descripcion: descripcion
            });
        }

        // Agregar campos al embed por categoría
        const ordenCategorias = ['util', 'music', 'fun', 'admin', 'welcome', 'level'];

        for (const categoria of ordenCategorias) {
            if (categorias[categoria]) {
                const cmds = categorias[categoria];
                
                // Ordenar comandos alfabéticamente
                cmds.sort((a, b) => a.nombre.localeCompare(b.nombre));

                // Crear texto con todos los comandos de esta categoría
                let textoComandos = '';
                for (const cmd of cmds) {
                    textoComandos += `\n\`/${cmd.nombre}\` - ${cmd.descripcion}`;
                }

                const infoCategoria = categoriasInfo[categoria] || { nombre: categoria, emoji: '📌' };

                embed.addFields({
                    name: `${infoCategoria.nombre} (${cmds.length})`,
                    value: textoComandos || 'Sin comandos',
                    inline: false
                });
            }
        }

        embed.setFooter({ 
            text: `Bot - ${new Date().toLocaleDateString('es-ES')}`
        });
        embed.setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: 0 // No ephemeral, visible para todos
        });
    }
};
