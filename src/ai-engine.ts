import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { KnowledgeManager } from './knowledge-manager';

dotenv.config();

export class AIEngine {
    private genAI: GoogleGenerativeAI;
    private knowledgeManager: KnowledgeManager;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || "";
        console.log(`Gemini API Key yüklü: ${!!apiKey} (Uzunluk: ${apiKey.length})`);
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.knowledgeManager = new KnowledgeManager();
    }


    async generateResponse(userMessage: string): Promise<string> {
        const knowledge = this.knowledgeManager.getKnowledge();
        const model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });




        const prompt = `
            ${knowledge.persona}
            İşletme Adı: ${knowledge.business_name}
            
            BİLGİ BANKASI:
            ${knowledge.knowledge_base.join('\n')}
            
            MÜŞTERİ MESAJI:
            "${userMessage}"
            
            TALİMAT: Yukarıdaki bilgi bankasına dayanarak müşteriye cevap ver. Eğer bilgi bankasında olmayan bir şey sorulursa, kibarca bilgi sahibi olmadığını ve yetkiliye ileteceğini söyle. Cevabın kısa ve Instagram DM formatına uygun olsun.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Yanıt Üretme Hatası:", error);
            return "Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyiniz.";
        }
    }
}
