const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { BOT_TOKEN, CHAT_ID } = process.env;
    if (!BOT_TOKEN || !CHAT_ID) return { statusCode: 500, body: "Config missing" };

    try {
        const userData = JSON.parse(event.body);
        const { first_name, last_name, username, id } = userData;

        // HTML formatida tartibli tashrif xabari
        const text = `<b>🔔 Mini App: Yangi tashrif</b>\n\n` +
                     `<b>👤 Foydalanuvchi:</b> ${first_name || ''} ${last_name || ''}\n` +
                     `<b>🆔 ID:</b> <code>${id}</code>\n` +
                     `<b>🔗 Username:</b> ${username ? '@' + username : 'mavjud emas'}\n` +
                     `<b>⏰ Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                resolve({ statusCode: 200, body: "OK" });
            });
            req.on('error', () => resolve({ statusCode: 500, body: "Error" }));
            req.write(data);
            req.end();
        });

    } catch (err) {
        return { statusCode: 500, body: "Error" };
    }
};
