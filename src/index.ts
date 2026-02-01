import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { AIEngine } from './ai-engine';
import { InstagramAPI } from './ig-api';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Instagram AI Agent Çalışıyor! 🚀 (Webhook Hazır)');
});

const aiEngine = new AIEngine();
const igApi = new InstagramAPI();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Meta Webhook Doğrulama (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook doğrulandı!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Meta Webhook Mesaj Alma (POST)
app.post('/webhook', async (req, res) => {
    const body = req.body;
    console.log("📥 Gelen Webhook İsteği:", JSON.stringify(body, null, 2));

    if (body.object === 'instagram') {
        try {
            for (const entry of body.entry) {
                for (const messaging of entry.messaging) {
                    if (messaging.message && messaging.message.text) {
                        const senderId = messaging.sender.id;
                        const messageText = messaging.message.text;

                        console.log(`💬 Mesaj (${senderId}): ${messageText}`);

                        // AI ile cevap üret
                        console.log("🤖 AI Cevabı hazırlanıyor...");
                        const aiResponse = await aiEngine.generateResponse(messageText);
                        console.log("🤖 AI Cevabı:", aiResponse);

                        // Instagram üzerinden cevap gönder
                        console.log("📤 Instagram'a gönderiliyor...");
                        await igApi.sendMessage(senderId, aiResponse);
                    } else {
                        console.log("⚠️ Mesaj içeriği veya text yok:", messaging);
                    }
                }
            }
            res.status(200).send('EVENT_RECEIVED');
        } catch (err) {
            console.error("❌ Webhook İşleme Hatası:", err);
            res.sendStatus(500);
        }
    } else {
        console.log("⚠️ Tanınmayan event object:", body.object);
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Instagram AI Ajanı ${PORT} portunda çalışıyor.`);
});
