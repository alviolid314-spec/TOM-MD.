const fs = require("fs");
const dbFile = "./database/users.json";

function load() {
    return JSON.parse(fs.readFileSync(dbFile));
}

function save(db) {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function addCoins(id, amount) {
    let db = load();
    if (!db[id]) db[id] = { coins: 0 };
    db[id].coins += amount;
    save(db);
}

module.exports = { addCoins };
