const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario.')
    .addUserOption(opt => 
      opt.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('tiempo')
        .setDescription('Duración del ban (ej: 1d, 5h, o "perma")')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon')
        .setDescription('Razón del ban')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('publico')
        .setDescription('¿Anunciar públicamente? (si / no)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const tiempo = interaction.options.getString('tiempo');
    const razon = interaction.options.getString('razon');
    const publico = interaction.options.getString('publico').toLowerCase();

    const miembro = interaction.guild.members.cache.get(usuario.id);

    if (!miembro)
      return interaction.reply({ content: 'No puedo encontrar al usuario.', ephemeral: true });

    // Ban
    await miembro.ban({ reason: razon });

    await interaction.reply(`🔨 ${usuario.tag} ha sido baneado.`);

    // CANALES DE REGISTRO
    const logPrivado = interaction.guild.channels.cache.get("1115386416898252961");
    const logPublico = interaction.guild.channels.cache.get("986749625614602345");

    // Registro privado (siempre)
    logPrivado?.send(`🔨 **BAN**
👤 Usuario: ${usuario.tag}
🕒 Tiempo: ${tiempo}
📝 Razón: ${razon}
👮 Moderador: ${interaction.user.tag}
    `);

    // Registro público (solo si el usuario lo pide)
    if (publico === "si") {
      logPublico?.send(`🔨 **BAN PUBLICO**  
**${usuario.tag}** fue baneado.  
📝 Razón: ${razon}`);
    }
  }
};