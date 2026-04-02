const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    // 📱 Pairing Code Login
    if (!sock.authState.creds.registered) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("📱 Enter your WhatsApp number (with country code): ", async (number) => {

            let code = await sock.requestPairingCode(number);
            console.log(`\n🔑 Your Pairing Code: ${code}\n`);
            console.log("👉 Open WhatsApp > Linked Devices > Link with code");

            rl.close();
        });
    }

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log("✅ Rahi Bot Connected with Pairing Code!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text;
        if (!text) return;

        const from = m.key.remoteJid;

        if (text === "hi") {
            await sock.sendMessage(from, { text: "👋 Rahi Bot is alive (Pairing Mode)" });
        }
    });
}

startBot();
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
