const { createWelcomeEmbed } = require(`${global.APP_ROOT}/commands/welcome/embedBuilder`);
const { getGuildConfig } = require(`${global.APP_ROOT}/commands/welcome/welcomeStore`);

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        if (!config || !config.enabled || !config.channelId) return;

        const canalBienvenida = member.guild.channels.cache.get(config.channelId)
            || await member.guild.channels.fetch(config.channelId).catch(() => null);

        if (!canalBienvenida) return;

        const embed = createWelcomeEmbed(member);
        canalBienvenida.send({ embeds: [embed] }).catch(() => null);
    }
};
