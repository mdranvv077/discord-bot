// ========================================
// MANEJO GLOBAL DE ERRORES
// ========================================
process.on('unhandledRejection', error => {
    console.error('❌ Error Asíncrono no Capturado (UNHANDLED REJECTION):', error);
});

process.on('uncaughtException', error => {
    console.error('❌ Error Síncrono no Capturado (UNCAUGHT EXCEPTION):', error);
});

// ========================================
// INICIALIZACIÓN
// ========================================
global.APP_ROOT = __dirname;
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// CLIENTE CON INTENTS DE VOZ Y MÚSICA
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ]
});

client.on('error', err => {
    console.error('❌ Error del Cliente de Discord (CLIENT.ON):', err);
});

client.commands = new Collection();

// ========================================
// SISTEMA DE COLAS DE MÚSICA POR SERVIDOR
// ========================================
client.musicQueues = new Map(); // { guildId: { queue: [], playing: false, connection: null, resource: null } }

// ========================================
// CARGAR COMANDOS EN SUBCARPETAS
// ========================================
const commandsPath = path.join(__dirname, 'commands');

function cargarCarpeta(ruta) {
    if (!fs.existsSync(ruta)) return;
    const archivos = fs.readdirSync(ruta, { withFileTypes: true });

    for (const archivo of archivos) {
        if (archivo.isDirectory()) {
            cargarCarpeta(path.join(ruta, archivo.name));
        } else if (archivo.name.endsWith('.js')) {
            const filePath = path.join(ruta, archivo.name);
            const command = require(filePath);

            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`⚠️ El archivo ${archivo.name} no contiene data o execute.`);
            }
        }
    }
}

cargarCarpeta(commandsPath);

// ========================================
// CARGA AUTOMÁTICA DE EVENTOS
// ========================================
const eventsPath = path.join(__dirname, 'events');
if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath);

const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (!event.name || !event.execute) continue;

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// ========================================
// BOT LISTO Y ESTADO
// ========================================
client.once('ready', () => {
    console.log(`Listo! Conectado como ${client.user.tag}`);

    function actualizarEstado() {
        let ping = Math.round(client.ws.ping);
        if (ping < 0) ping = 0;

        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: `Ping: ${ping} ms | Operativo ✅`,
                    type: 3 // Watching
                }
            ]
        });
    }

    actualizarEstado();
    setInterval(actualizarEstado, 30000); // 30 segundos es más sano para el API
});

// ========================================
// MANEJO DE COMANDOS
// ========================================
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (err) {
        console.error('❌ Error al ejecutar el comando:', err);
        const errorMsg = { content: 'Ocurrió un error al ejecutar ese comando.', ephemeral: true };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg);
        } else {
            await interaction.reply(errorMsg);
        }
    }
});

// ========================================
// LOGIN
// ========================================
client.login(process.env.TOKEN);