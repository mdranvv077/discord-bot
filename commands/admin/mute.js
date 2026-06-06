const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms'); // necesitas instalar `npm install ms`

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia temporalmente a un usuario.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a mutear')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('tiempo')
        .setDescription('Ejemplo: 10m, 1h, 2d')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon')
        .setDescription('Razón')
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
    const tiempo = interaction.options.getString('tiempo');
    const razon = interaction.options.getString('razon');
    const publico = interaction.options.getString('publico').toLowerCase();

    const miembro = interaction.guild.members.cache.get(usuario.id);

    if (!miembro)
      return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });

    const msTiempo = ms(tiempo);
    if (!msTiempo)
      return interaction.reply({ content: 'Formato de tiempo inválido.', ephemeral: true });

    await miembro.timeout(msTiempo, razon);

    await interaction.reply(`🔇 ${usuario.tag} ha sido muteado por ${tiempo}.`);

    const logPrivado = interaction.guild.channels.cache.get("1115386416898252961");
    const logPublico = interaction.guild.channels.cache.get("986749625614602345");

    logPrivado?.send(`🔇 **MUTE**
👤 Usuario: ${usuario.tag}
🕒 Tiempo: ${tiempo}
📝 Razón: ${razon}
👮 Moderador: ${interaction.user.tag}`);

    if (publico === "si") {
      logPublico?.send(`🔇 **MUTE PUBLICO**  
**${usuario.tag}** fue muteado por ${tiempo}.  
📝 Razón: ${razon}`);
    }
  }
};