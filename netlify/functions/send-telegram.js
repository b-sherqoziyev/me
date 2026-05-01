// Node.js 18+ versiyalarida fetch global tarzda mavjud
exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, email, message } = JSON.parse(event.body);
        const { BOT_TOKEN, CHAT_ID } = process.env;

        if (!BOT_TOKEN || !CHAT_ID) {
            return { 
                statusCode: 500, 
                body: JSON.stringify({ error: "Bot ma'lumotlari Netlify sozlamalarida kiritilmagan!" }) 
            };
        }

        const text = `🚀 *Yangi xabar (Portfolio)*\n\n` +
                     `👤 *Ism:* ${name}\n` +
                     `📧 *Email:* ${email}\n\n` +
                     `💬 *Xabar:* \n${message}`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();

        if (result.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Xabar muvaffaqiyatli yuborildi!" })
            };
        } else {
            throw new Error(result.description);
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
