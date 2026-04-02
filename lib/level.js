const fs = require("fs");

const dbFile = "./database/users.json";

function getUser(id) {
    let db = JSON.parse(fs.readFileSync(dbFile));
    if (!db[id]) db[id] = { xp: 0, level: 1 };
    return db;
}

function addXP(id) {
    let db = getUser(id);
    db[id].xp += 10;

    if (db[id].xp >= db[id].level * 100) {
        db[id].level++;
        db[id].xp = 0;
    }

    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

module.exports = { addXP };
