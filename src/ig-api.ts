import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class InstagramAPI {
    private accessToken: string;
    private pageId: string;

    constructor() {
        this.accessToken = process.env.ACCESS_TOKEN || "";
        this.pageId = process.env.INSTAGRAM_PAGE_ID || "";
        console.log(`IG API Yüklü: Token: ${!!this.accessToken} (${this.accessToken.length}), PageID: ${this.pageId}`);
    }


    async sendMessage(recipientId: string, text: string): Promise<void> {
        const url = `https://graph.facebook.com/v17.0/${this.pageId}/messages`;

        const payload = {
            recipient: { id: recipientId },
            message: { text: text }
        };

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            console.log("Mesaj başarıyla gönderildi:", response.data);

        } catch (error: any) {
            console.error("Instagram API Mesaj Gönderme Hatası:", error.response?.data || error.message);
        }
    }
}
