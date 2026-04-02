const axios = require("axios");

async function aiReply(prompt) {
    const res = await axios.get(`https://api.affiliateplus.xyz/api/chatbot?message=${prompt}&botname=RahiBot&owner=Rahi`);
    return res.data.message;
}

module.exports = { aiReply };
