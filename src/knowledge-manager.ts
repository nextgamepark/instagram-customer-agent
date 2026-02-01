import fs from 'fs';
import path from 'path';

export interface Knowledge {
    business_name: string;
    persona: string;
    knowledge_base: string[];
}

export class KnowledgeManager {
    private filePath: string;

    constructor() {
        this.filePath = path.join(process.cwd(), 'knowledge.json');
    }

    getKnowledge(): Knowledge {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Bilgi bankası okunurken hata oluştu:", error);
            return {
                business_name: "Bilinmeyen İşletme",
                persona: "Profesyonel bir asistan.",
                knowledge_base: []
            };
        }
    }

    updateKnowledge(newKnowledge: Knowledge): void {
        fs.writeFileSync(this.filePath, JSON.stringify(newKnowledge, null, 2));
    }
}
