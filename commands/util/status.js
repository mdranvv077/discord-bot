const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

// ============================
// CONTADOR DE MENSAJES (Opcional)
// ============================
let mensajesEnviados = 0;

// ============================
// COMANDO STATUS (Limpio)
// ============================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Muestra información detallada del estado del bot.'),

    async execute(interaction, client) {
        // Usamos deferReply porque el fetchReply puede tardar unos milisegundos
        await interaction.deferReply({ ephemeral: false });

        // ============================
        // LATENCIAS
        // ============================
        const wsPing = client.ws.ping;
        const apiPingStart = Date.now();
        const apiPing = await interaction.fetchReply()
            .then(() => Date.now() - apiPingStart);

        // ============================
        // UPTIME
        // ============================
        function formato(ms) {
            const s = Math.floor(ms / 1000) % 60;
            const m = Math.floor(ms / (1000 * 60)) % 60;
            const h = Math.floor(ms / (1000 * 60 * 60)) % 24;
            const d = Math.floor(ms / (1000 * 60 * 60 * 24));
            return `${d}d ${h}h ${m}m ${s}s`;
        }

        const uptimeBot = formato(client.uptime);

        // ============================
        // DATOS GLOBALES
        // ============================
        const totalServers = client.guilds.cache.size;
        const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        const totalChannels = client.channels.cache.size;
        const totalCommands = client.commands.size;

        // ============================
        // FECHA DE CREACIÓN
        // ============================
        const creadoTimestamp = Math.floor(client.user.createdTimestamp / 1000);

        // ============================
        // PERMISOS DEL BOT
        // ============================
        const permisosBot = interaction.guild.members.me.permissions;
        const permisosLista = new PermissionsBitField(permisosBot.bitfield)
            .toArray()
            .map(p => `• ${p}`)
            .join('\n');

        // ============================
        // EMBED (Sin música)
        // ============================
        const embed = new EmbedBuilder()
            .setColor('#8e44ad')
            .setTitle('📊 Estado detallado del bot')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '⚡ Latencia',
                    value: `WebSocket: **${wsPing}ms**\nAPI Discord: **${apiPing}ms**`,
                    inline: true
                },
                {
                    name: '⏳ Uptime',
                    value: `\`${uptimeBot}\``,
                    inline: true
                },
                {
                    name: '🌐 Actividad global',
                    value: `Servidores: **${totalServers}**\nUsuarios: **${totalUsers}**\nCanales: **${totalChannels}**`,
                    inline: false
                },
                {
                    name: '🤖 Datos del bot',
                    value: `Comandos cargados: **${totalCommands}**`,
                    inline: false
                },
                {
                    name: '📅 Fecha de creación',
                    value: `<t:${creadoTimestamp}:F>`,
                    inline: false
                },
                {
                    name: '🛡️ Permisos en este servidor',
                    value: `\`\`\`\n${permisosLista || 'Sin permisos especiales'}\n\`\`\``,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({
                text: `Solicitado por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        await interaction.editReply({ embeds: [embed] });
    }
};