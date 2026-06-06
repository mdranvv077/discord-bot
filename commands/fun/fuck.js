const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fuck')
        .setDescription('Comando divertido para decir que alguien violó a uno o más usuarios.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario que viola')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('objetivo1')
                .setDescription('El primer usuario al que se viola')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('objetivo2')
                .setDescription('El segundo usuario al que se viola (opcional)')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('objetivo3')
                .setDescription('El tercer usuario al que se viola (opcional)')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('objetivo4')
                .setDescription('El cuarto usuario al que se viola (opcional)')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('objetivo5')
                .setDescription('El quinto usuario al que se viola (opcional)')
                .setRequired(false)),
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const objetivos = [];
        for (let i = 1; i <= 5; i++) {
            const obj = interaction.options.getUser(`objetivo${i}`);
            if (obj) objetivos.push(obj);
        }

        const acciones = ['violó', 'folló', 'culió', 'penetró', 'fornicó'];
        const accion = acciones[Math.floor(Math.random() * acciones.length)];

        let mensaje = `${usuario} se ${accion} a `;
        if (objetivos.length === 1) {
            mensaje += `${objetivos[0]}.`;
        } else {
            const ultimos = objetivos.slice(-2);
            const primeros = objetivos.slice(0, -2);
            mensaje += primeros.join(', ') + (primeros.length > 0 ? ', ' : '') + ultimos.join(' y ') + '.';
        }

        await interaction.reply(mensaje);
    },
};