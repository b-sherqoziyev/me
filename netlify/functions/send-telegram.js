const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { BOT_TOKEN, CHAT_ID } = process.env;
    if (!BOT_TOKEN || !CHAT_ID) return { statusCode: 500, body: "Config missing" };

    try {
        const body = JSON.parse(event.body);
        
        // HTML formatida tartibli xabar
        const messageText = `<b>🚀 Yangi xabar (Portfolio)</b>\n\n` +
                            `<b>👤 Ism:</b> ${body.name}\n` +
                            `<b>💬 Xabar:</b>\n<i>${body.message}</i>`;

        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML' // HTML rejimi yulduzchalarsiz ishlaydi
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
