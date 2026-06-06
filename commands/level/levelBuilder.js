const { EmbedBuilder } = require('discord.js');
const { getRequiredMessagesForLevel } = require('./levelStore');

function createLevelUpEmbed(member, newLevel, multiplier) {
    const user = member.user;
    const nextLevelMessages = getRequiredMessagesForLevel(newLevel + 1, multiplier);

    return new EmbedBuilder()
        .setColor('#FFD700')
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setTitle(`🎉 ¡${user.username} subió de nivel!`)
        .setDescription(`¡Felicidades! Has alcanzado el **nivel ${newLevel}**.`)
        .addFields(
            {
                name: '📊 Nivel actual',
                value: `${newLevel}`,
                inline: true
            },
            {
                name: '💬 Mensajes para siguiente nivel',
                value: `${nextLevelMessages} mensajes`,
                inline: true
            }
        )
        .setFooter({
            text: 'Sistema de niveles',
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();
}

function createLevelEmbed(member, userData, multiplier) {
    const user = member.user;
    const nextLevelMessages = getRequiredMessagesForLevel(userData.level + 1, multiplier);
    const progress = userData.messages - getRequiredMessagesForLevel(userData.level, multiplier);
    const requiredForNext = nextLevelMessages - getRequiredMessagesForLevel(userData.level, multiplier);

    return new EmbedBuilder()
        .setColor('#FFD700')
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setTitle(`📊 Nivel de ${user.username}`)
        .addFields(
            {
                name: '📊 Nivel actual',
                value: `${userData.level}`,
                inline: true
            },
            {
                name: '💬 Mensajes totales',
                value: `${userData.messages}`,
                inline: true
            },
            {
                name: '🎯 Próximo nivel',
                value: `${nextLevelMessages} mensajes (${requiredForNext - progress} restantes)`,
                inline: false
            }
        )
        .setFooter({
            text: 'Sistema de niveles',
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();
}

function createTopLevelEmbed(guild, topUsers, multiplier) {
    const description = topUsers.map((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `**${index + 1}.**`;
        return `${medal} <@${user.userId}> - Nivel ${user.level} (${user.messages} mensajes)`;
    }).join('\n');

    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`🏆 Top Niveles en ${guild.name}`)
        .setDescription(description || 'No hay usuarios con niveles aún.')
        .setFooter({
            text: `Sistema de niveles`,
            iconURL: guild.iconURL({ dynamic: true })
        })
        .setTimestamp();

    // Agregar información del multiplicador como campo
    embed.addFields({
        name: '⚙️ Configuración del Sistema',
        value: `**Multiplicador:** x${multiplier}`,
        inline: false
    });

    return embed;
}

module.exports = {
    createLevelUpEmbed,
    createLevelEmbed,
    createTopLevelEmbed
};
