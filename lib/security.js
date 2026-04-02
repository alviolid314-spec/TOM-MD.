module.exports = {

    antiLink: async (sock, m, text, config) => {
        if (config.antiLink && text.includes("chat.whatsapp.com")) {
            await sock.sendMessage(m.key.remoteJid, { text: "🚫 Link detected!" });
        }
    },

    antiSpam: async (sock, m, userMsgCount) => {
        if (userMsgCount > 5) {
            await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Spam detected!" });
        }
    }

};
