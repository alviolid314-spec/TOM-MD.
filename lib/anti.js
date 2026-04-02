module.exports = {
    antiLink: async (sock, msg, text, config) => {
        if (config.antiLink && text.includes("chat.whatsapp.com")) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "🚫 Links are not allowed!"
            });
        }
    }
};
