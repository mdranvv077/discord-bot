const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario.')
    .addUserOption(opt => 
      opt.setName('usuario')
        .setDescription('Usuario a expulsar')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon')
        .setDescription('Razón del kick')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('publico')
        .setDescription('¿Anunciar públicamente? (si / no)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const razon = interaction.options.getString('razon');
    const publico = interaction.options.getString('publico').toLowerCase();

    const miembro = interaction.guild.members.cache.get(usuario.id);

    if (!miembro)
      return interaction.reply({ content: 'No encuentro al usuario.', ephemeral: true });

    await miembro.kick(razon);

    await interaction.reply(`👢 ${usuario.tag} fue expulsado.`);

    const logPrivado = interaction.guild.channels.cache.get("1115386416898252961");
    const logPublico = interaction.guild.channels.cache.get("986749625614602345");

    logPrivado?.send(`👢 **KICK**
👤 Usuario: ${usuario.tag}
📝 Razón: ${razon}
👮 Moderador: ${interaction.user.tag}`);

    if (publico === "si") {
      logPublico?.send(`👢 **KICK PUBLICO**  
**${usuario.tag}** fue expulsado.  
📝 Razón: ${razon}`);
    }
  }
};