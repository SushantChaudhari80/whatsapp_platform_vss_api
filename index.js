const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

// Initialize WhatsApp client
// const client = new Client({
//     authStrategy: new LocalAuth(), // Saves session
//     puppeteer: { headless: true }
// });
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});


// Show QR in terminal
client.on('qr', qr => {
    console.log("📱 Scan this QR Code in your WhatsApp App:");
    qrcode.generate(qr, { small: true });
});

// Ready message
client.on('ready', () => {
    console.log("✅ WhatsApp is ready to send messages!");
});

// Initialize the client
client.initialize();

// API to send WhatsApp message
app.post('/send', async (req, res) => {
    const { groupId, message } = req.body;
    if (!groupId || !message) {
        return res.status(400).send("❌ groupId and message are required");
    }

    console.log(`📨 Sending to ${groupId}: ${message}`);
    try {
        await client.sendMessage(groupId, message);
        res.send("✅ Message sent!");
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).send("❌ Failed to send message");
    }
});

// Start the server
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
