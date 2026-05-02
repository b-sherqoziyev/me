const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { BOT_TOKEN, CHAT_ID } = process.env;

    if (!BOT_TOKEN || !CHAT_ID) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "BOT_TOKEN yoki CHAT_ID topilmadi!" }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        // Email maydoni olib tashlangani uchun faqat Ism va Xabar yuboramiz
        const messageText = `🚀 *Yangi xabar (Portfolio)*\n\n👤 *Ism:* ${body.name}\n💬 *Xabar:* ${body.message}`;

        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'Markdown'
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

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => responseBody += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        body: responseBody
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: error.message })
                });
            });

            req.write(data);
            req.end();
        });

    } catch (err) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "JSON parsing xatosi yoki ichki xato" }) 
        };
    }
};
