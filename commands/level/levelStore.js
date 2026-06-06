const fs = require('fs');
const path = require('path');

const settingsPath = path.join(global.APP_ROOT, 'level-settings.json');
const dataPath = path.join(global.APP_ROOT, 'level-data.json');

function loadSettings() {
    if (!fs.existsSync(settingsPath)) {
        return {};
    }
    try {
        const content = fs.readFileSync(settingsPath, 'utf8');
        return content.trim().length ? JSON.parse(content) : {};
    } catch (err) {
        console.error('❌ Error leyendo configuración de niveles:', err);
        return {};
    }
}

function saveSettings(settings) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    } catch (err) {
        console.error('❌ Error guardando configuración de niveles:', err);
    }
}

function loadData() {
    if (!fs.existsSync(dataPath)) {
        return {};
    }
    try {
        const content = fs.readFileSync(dataPath, 'utf8');
        return content.trim().length ? JSON.parse(content) : {};
    } catch (err) {
        console.error('❌ Error leyendo datos de niveles:', err);
        return {};
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('❌ Error guardando datos de niveles:', err);
    }
}

function getGuildSettings(guildId) {
    const settings = loadSettings();
    return settings[guildId] || { channelId: null, multiplier: 1.5 };
}

function setGuildSettings(guildId, settings) {
    const allSettings = loadSettings();
    allSettings[guildId] = settings;
    saveSettings(allSettings);
}

function getUserData(guildId, userId) {
    const data = loadData();
    if (!data[guildId]) data[guildId] = {};
    return data[guildId][userId] || { messages: 0, level: 0 };
}

function updateUserData(guildId, userId, newData) {
    const data = loadData();
    if (!data[guildId]) data[guildId] = {};
    data[guildId][userId] = { ...data[guildId][userId], ...newData };
    saveData(data);
}

function calculateLevel(messages, multiplier = 1.5) {
    if (messages < 10) return 0;

    let level = 0;
    let required = 10;
    let totalRequired = 0;

    while (totalRequired + required <= messages) {
        level++;
        totalRequired += required;
        required = Math.ceil(required * multiplier);
    }

    return level;
}

function getRequiredMessagesForLevel(level, multiplier = 1.5) {
    let required = 10;
    let total = 0;
    for (let i = 1; i <= level; i++) {
        total += required;
        required = Math.ceil(required * multiplier);
    }
    return total;
}

function getTopUsers(guildId, limit = 10) {
    const data = loadData();
    const guildData = data[guildId] || {};

    return Object.entries(guildData)
        .map(([userId, userData]) => ({ userId, ...userData }))
        .sort((a, b) => b.level - a.level || b.messages - a.messages)
        .slice(0, limit);
}

module.exports = {
    getGuildSettings,
    setGuildSettings,
    getUserData,
    updateUserData,
    calculateLevel,
    getRequiredMessagesForLevel,
    getTopUsers
};
