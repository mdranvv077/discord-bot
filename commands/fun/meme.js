const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// fetch universal (sirve para cualquier Node)
let fetchFunc = globalThis.fetch;
if (!fetchFunc) {
    fetchFunc = (...args) =>
        import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Envía un meme actual (imagen o GIF).')
        .addStringOption(opt =>
            opt.setName('subreddit')
                .setDescription('(Opcional) Subreddit específico')
                .setRequired(false)
        )
        .addBooleanOption(opt =>
            opt.setName('gif')
                .setDescription('Forzar GIF')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply(); // evita el timeout

        const subreddit = interaction.options.getString('subreddit');
        const gifOnly = interaction.options.getBoolean('gif') ?? false;

        try {
            // Timeout de seguridad para no colgar al bot
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 5000);

            const url = subreddit
                ? `https://meme-api.com/gimme/${encodeURIComponent(subreddit)}`
                : `https://meme-api.com/gimme`;

            const res = await fetchFunc(url, { signal: controller.signal });

            if (!res.ok) {
                throw new Error(`API respondió ${res.status}`);
            }

            const data = await res.json();

            // Si pidió GIF y no lo es → buscar otro automáticamente
            if (gifOnly) {
                const isGif =
                    data.url.endsWith('.gif') || data.url.includes('.gif');

                if (!isGif) {
                    const res2 = await fetchFunc('https://meme-api.com/gimme');
                    const data2 = await res2.json();
                    if (data2.url) data.url = data2.url;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(data.title?.slice(0, 256) || 'Meme')
                .setColor('#7415D9')
                .setImage(data.url)
                .setFooter({
                    text: `r/${data.subreddit} • u/${data.author}`
                });

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error(err);

            // Evita el error "La aplicación no respondió"
            await interaction.editReply(
                'No pude obtener un meme en este momento.'
            );
        }
    }
};