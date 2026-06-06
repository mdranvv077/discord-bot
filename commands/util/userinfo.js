// commands/util/userinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información completa del usuario.'),

    async execute(interaction) {
        const usuario = interaction.user;
        const miembro = interaction.guild.members.cache.get(usuario.id);

        const creado = `<t:${Math.floor(usuario.createdTimestamp / 1000)}:f>`;
        const unido = `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:f>`;

        const ahora = Date.now();
        const tiempoDiscord = Math.floor((ahora - usuario.createdTimestamp) / (1000 * 60 * 60 * 24));
        const tiempoServidor = Math.floor((ahora - miembro.joinedTimestamp) / (1000 * 60 * 60 * 24));

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`Información de ${usuario.username}`)
            .setThumbnail(usuario.displayAvatarURL({ size: 1024, dynamic: true }))
            .addFields(
                {
                    name: '👤 Nombre',
                    value: usuario.tag,
                    inline: true
                },
                {
                    name: '🆔 ID',
                    value: usuario.id,
                    inline: true
                },
                {
                    name: '📅 Cuenta creada',
                    value: `${creado}\n(${tiempoDiscord} días)`,
                    inline: false
                },
                {
                    name: '📥 Entró al servidor',
                    value: `${unido}\n(${tiempoServidor} días)`,
                    inline: false
                }
            )
            .setFooter({
                text: 'Información del usuario',
                iconURL: usuario.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed] });
    }
};