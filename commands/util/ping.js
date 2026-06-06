// commands/util/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra el ping del bot.'),

    async execute(interaction) {
        const ping = interaction.client.ws.ping;

        await interaction.reply({
            content: `Mi ping es **${ping} ms**.`,
            ephemeral: false
        });
    }
};