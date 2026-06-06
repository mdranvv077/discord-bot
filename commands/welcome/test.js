const { SlashCommandBuilder } = require('discord.js');
const { createWelcomeEmbed, createGoodbyeEmbed } = require('./embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Prueba la bienvenida o despedida enviando un embed de ejemplo.')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Elige si probar la bienvenida o la despedida.')
                .setRequired(true)
                .addChoices(
                    { name: 'bienvenida', value: 'bienvenida' },
                    { name: 'despedida', value: 'despedida' }
                )
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario de ejemplo para la prueba.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, channel } = interaction;
        if (!guild) {
            return interaction.reply({ content: 'Este comando solo se puede usar en servidores.', ephemeral: true });
        }

        const tipo = interaction.options.getString('tipo');
        const user = interaction.options.getUser('usuario');
        const member = interaction.options.getMember('usuario') || await guild.members.fetch(user.id).catch(() => null);

        if (!user) {
            return interaction.reply({ content: 'Debes mencionar un usuario válido para la prueba.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'No pude obtener la información del miembro en este servidor.', ephemeral: true });
        }

        const embed = tipo === 'bienvenida'
            ? createWelcomeEmbed(member)
            : createGoodbyeEmbed(member);

        await channel.send({ embeds: [embed] });
        return interaction.reply({ content: `Mensaje de prueba de ${tipo} enviado en este canal.`, ephemeral: true });
    }
};
