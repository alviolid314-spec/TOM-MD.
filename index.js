const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const config = require("./config");
const { aiReply } = require("./lib/ai");
const { antiLink } = require("./lib/security");
const { addCoins } = require("./lib/economy");

let spamTracker = {};

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const m = messages[0];
        if (!m.message) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text;
        if (!text) return;

        const from = m.key.remoteJid;
        const sender = m.key.participant || from;

        // Spam tracker
        spamTracker[sender] = (spamTracker[sender] || 0) + 1;

        // Security
        await antiLink(sock, m, text, config);

        // Economy reward
        addCoins(sender, 1);

        // AUTO AI
        if (config.autoAI && !text.startsWith(config.prefix)) {
            const reply = await aiReply(text);
            await sock.sendMessage(from, { text: reply });
        }

        // Commands
        if (text.startsWith(config.prefix)) {
            const [cmd, ...args] = text.slice(1).split(" ");

            switch (cmd) {

                case "menu":
                    await sock.sendMessage(from, {
                        text: `😈 RAHI BOT GOD MENU

.ai
.yt
.tiktok
.coins
.admin`
                    });
                break;

                case "ai":
                    const ai = await aiReply(args.join(" "));
                    await sock.sendMessage(from, { text: ai });
                break;

                case "coins":
                    await sock.sendMessage(from, { text: "💰 Coins system active!" });
                break;

                default:
                    await sock.sendMessage(from, { text: "❌ Unknown command" });
            }
        }
    });
}

startBot();
