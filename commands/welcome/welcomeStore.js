const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(global.APP_ROOT, 'welcome-settings.json');

function cargarDatos() {
    if (!fs.existsSync(rutaArchivo)) {
        return {};
    }

    try {
        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        return contenido.trim().length ? JSON.parse(contenido) : {};
    } catch (err) {
        console.error('❌ Error leyendo la configuración de welcome:', err);
        return {};
    }
}

function guardarDatos(datos) {
    try {
        fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), 'utf8');
    } catch (err) {
        console.error('❌ Error guardando la configuración de welcome:', err);
    }
}

function getGuildConfig(guildId) {
    const datos = cargarDatos();
    return datos[guildId] || null;
}

function setGuildConfig(guildId, config) {
    const datos = cargarDatos();
    datos[guildId] = config;
    guardarDatos(datos);
    return datos[guildId];
}

function disableGuildConfig(guildId) {
    const datos = cargarDatos();
    if (!datos[guildId]) return null;
    datos[guildId].enabled = false;
    guardarDatos(datos);
    return datos[guildId];
}

module.exports = {
    getGuildConfig,
    setGuildConfig,
    disableGuildConfig
};
