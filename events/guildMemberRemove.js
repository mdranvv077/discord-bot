const { createGoodbyeEmbed } = require(`${global.APP_ROOT}/commands/welcome/embedBuilder`);
const { getGuildConfig } = require(`${global.APP_ROOT}/commands/welcome/welcomeStore`);

module.exports = {
    name: 'guildMemberRemove',

    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        if (!config || !config.enabled || !config.channelId) return;

        const canalDespedida = member.guild.channels.cache.get(config.channelId)
            || await member.guild.channels.fetch(config.channelId).catch(() => null);

        if (!canalDespedida) return;

        const embed = createGoodbyeEmbed(member);
        canalDespedida.send({ embeds: [embed] }).catch(() => null);
    }
};
