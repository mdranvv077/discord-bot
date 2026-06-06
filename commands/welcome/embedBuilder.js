const { EmbedBuilder } = require('discord.js');

function formatTimestamp(timestamp) {
    if (!timestamp) return 'No disponible';
    return `<t:${Math.floor(timestamp / 1000)}:f>`;
}

function formatDays(timestamp) {
    if (!timestamp) return '';
    const ahora = Date.now();
    const dias = Math.floor((ahora - timestamp) / (1000 * 60 * 60 * 24));
    return `\n(${dias} días)`;
}

function formatDuration(joinedTimestamp) {
    if (!joinedTimestamp) return 'No disponible';

    const ahora = Date.now();
    const totalSegundos = Math.floor((ahora - joinedTimestamp) / 1000);

    if (totalSegundos < 60) {
        return `${totalSegundos} segundo${totalSegundos === 1 ? '' : 's'}`;
    }

    const totalMinutos = Math.floor(totalSegundos / 60);
    if (totalMinutos < 60) {
        return `${totalMinutos} minuto${totalMinutos === 1 ? '' : 's'}`;
    }

    const totalHoras = Math.floor(totalMinutos / 60);
    if (totalHoras < 24) {
        return `${totalHoras} hora${totalHoras === 1 ? '' : 's'}`;
    }

    const totalDias = Math.floor(totalHoras / 24);
    if (totalDias < 30) {
        return `${totalDias} día${totalDias === 1 ? '' : 's'}`;
    }

    const totalMeses = Math.floor(totalDias / 30);
    if (totalMeses < 12) {
        return `${totalMeses} mes${totalMeses === 1 ? '' : 'es'}`;
    }

    const totalAnios = Math.floor(totalMeses / 12);
    return `${totalAnios} año${totalAnios === 1 ? '' : 's'}`;
}

function createMemberInfoEmbed(member, title, description) {
    const user = member.user;
    const creado = formatTimestamp(user.createdTimestamp) + formatDays(user.createdTimestamp);
    const unido = formatTimestamp(member.joinedTimestamp) + formatDays(member.joinedTimestamp);

    return new EmbedBuilder()
        .setColor('#6A0DAD')
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setTitle(title)
        .setDescription(description)
        .addFields(
            {
                name: '👤 Nombre',
                value: user.tag,
                inline: false
            },
            {
                name: '📅 Cuenta creada',
                value: creado,
                inline: false
            },
            {
                name: '📥 Entró al servidor',
                value: unido,
                inline: false
            }
        )
        .setFooter({
            text: 'Información de bienvenida/despedida',
            iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();
}

function createWelcomeEmbed(member) {
    return createMemberInfoEmbed(
        member,
        `🎉 ¡Bienvenido ${member.user.username}!`,
        '**Nos alegra que te unas a este servidor.**\nPonte cómodo y disfruta.'
    );
}

function createGoodbyeEmbed(member) {
    const embed = createMemberInfoEmbed(
        member,
        `${member.user.username} ha salido del servidor`,
        'Esperamos que vuelva pronto 👋'
    );

    return embed.addFields(
        {
            name: '📤 Fecha de salida',
            value: formatTimestamp(Date.now()),
            inline: false
        },
        {
            name: '⏱ Tiempo en el servidor',
            value: formatDuration(member.joinedTimestamp),
            inline: false
        }
    );
}

module.exports = {
    createWelcomeEmbed,
    createGoodbyeEmbed
};
