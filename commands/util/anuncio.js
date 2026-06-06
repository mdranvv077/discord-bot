const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anunciar")
    .setDescription("El bot enviará un anuncio en el canal que elijas.")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal donde se enviará el anuncio.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("mensaje")
        .setDescription("Mensaje que el bot enviará tal cual.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const canal = interaction.options.getChannel("canal");
    const mensaje = interaction.options.getString("mensaje");

    // Confirmación al moderador
    await interaction.reply({
      content: `📢 Mensaje enviado a **${canal}**.`,
      ephemeral: true
    });

    // Enviar el mensaje tal cual, sin embed
    canal.send(mensaje);
  }
};