const { getGuildSettings, getUserData, updateUserData, calculateLevel } = require(`${global.APP_ROOT}/commands/level/levelStore`);
const { createLevelUpEmbed } = require(`${global.APP_ROOT}/commands/level/levelBuilder`);

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        // Ignorar mensajes de bots
        if (message.author.bot) return;

        // Solo en servidores
        if (!message.guild) return;

        // No contar comandos
        if (message.content.startsWith('/')) return;

        // Solo contar mensajes con contenido válido
        const hasText = message.content && message.content.trim().length > 0;
        const hasAttachments = message.attachments && message.attachments.size > 0;
        const hasEmbeds = message.embeds && message.embeds.length > 0;

        // Si no tiene texto, attachments ni embeds, ignorar
        if (!hasText && !hasAttachments && !hasEmbeds) return;

        const { guild, author, channel } = message;
        const settings = getGuildSettings(guild.id);
        const userData = getUserData(guild.id, author.id);

        // Incrementar mensajes
        userData.messages += 1;

        // Calcular nuevo nivel
        const newLevel = calculateLevel(userData.messages, settings.multiplier);

        // Si subió de nivel
        if (newLevel > userData.level) {
            userData.level = newLevel;
            updateUserData(guild.id, author.id, userData);

            // Crear embed de subida de nivel
            const member = message.member;
            const embed = createLevelUpEmbed(member, newLevel, settings.multiplier);

            // Enviar al canal configurado o al actual
            const targetChannel = settings.channelId
                ? guild.channels.cache.get(settings.channelId) || channel
                : channel;

            targetChannel.send({ embeds: [embed] }).catch(() => null);
        } else {
            // Solo actualizar mensajes
            updateUserData(guild.id, author.id, userData);
        }
    }
};
