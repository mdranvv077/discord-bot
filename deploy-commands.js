// deploy-commands.js (FINAL)

require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');

// 1. 🎯 SOLUCIÓN AL ERROR: Definimos la ruta raíz del bot.
// Esto permite que comandos como disconnect.js y play.js puedan importar player.js 
// usando la ruta absoluta (`global.APP_ROOT/music/player.js`).
global.APP_ROOT = __dirname; 

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Leer carpetas recursivamente
function cargarCarpeta(ruta) {
    const archivos = fs.readdirSync(ruta, { withFileTypes: true });

    for (const archivo of archivos) {
        const rutaCompleta = path.join(ruta, archivo.name);

        if (archivo.isDirectory()) {
            cargarCarpeta(rutaCompleta);
        } else if (archivo.name.endsWith('.js')) {
            // Aquí es donde se carga el comando y se activa la importación de player.js
            const command = require(rutaCompleta); 

            if (!command.data) {
                console.log(`⚠️ El archivo ${archivo.name} no exporta "data". Se omitirá.`);
                continue;
            }

            if (typeof command.data.toJSON !== "function") {
                console.log(`❌ El comando ${archivo.name} tiene "data" pero NO es un SlashCommandBuilder válido.`);
                console.log("     Revisa la exportación de 'data'.");
                continue;
            }

            commands.push(command.data.toJSON());
        }
    }
}

cargarCarpeta(commandsPath);

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registrando comandos en el servidor...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✔ Comandos registrados correctamente');
    } catch (err) {
        console.error('Error al registrar comandos:', err);
    }
})();