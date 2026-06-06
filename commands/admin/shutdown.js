const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Apaga completamente el bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Solo admins

  async execute(interaction, client) {
    await interaction.reply({ content: '🛑 Apagando bot...', ephemeral: true });

    console.log('Comando /shutdown ejecutado. Cerrando bot...');

    // Desconectar bot correctamente
    client.destroy();

    // Cerrar proceso Node
    process.exit(0);
  }
};