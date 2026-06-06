const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remueve el mute de un usuario.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a desmutear')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('publico')
        .setDescription('¿Anunciar públicamente? (si / no)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const publico = interaction.options.getString('publico').toLowerCase();

    const miembro = interaction.guild.members.cache.get(usuario.id);

    if (!miembro)
      return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });

    await miembro.timeout(null);

    await interaction.reply(`🔊 ${usuario.tag} ha sido desmuteado.`);

    const logPrivado = interaction.guild.channels.cache.get("1115386416898252961");
    const logPublico = interaction.guild.channels.cache.get("986749625614602345");

    logPrivado?.send(`🔊 **UNMUTE**
👤 Usuario: ${usuario.tag}
👮 Moderador: ${interaction.user.tag}`);

    if (publico === "si") {
      logPublico?.send(`🔊 **UNMUTE PUBLICO**
**${usuario.tag}** fue desmuteado.`);
    }
  }
};