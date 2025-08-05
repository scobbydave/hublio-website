import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Mining compliance context for better AI responses
const MINING_COMPLIANCE_CONTEXT = `
You are a specialized AI assistant focused exclusively on mining regulations and compliance in South Africa and globally.
You should only answer questions related to:
- Mining safety regulations
- Environmental compliance for mining operations
- Labor laws specific to mining industry
- Mining permits and licensing
- Mining equipment safety standards
- Health and safety protocols in mines
- Environmental impact assessments for mining
- Mine closure and rehabilitation requirements
- Mining taxation and royalties
- Indigenous rights in mining
- Water use permits for mining
- Air quality standards for mining operations

If a question is not related to mining regulations or compliance, respond with:
"I can only help with mining regulations and compliance. Please ask questions related to mining safety, environmental compliance, labor laws, licensing, or other mining-specific regulatory matters."

Always include a disclaimer that your advice is for informational purposes only and users should consult with legal professionals for specific compliance matters.
`;

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateComplianceResponse(question: string): Promise<string> {
    try {
      const prompt = `${MINING_COMPLIANCE_CONTEXT}\n\nUser Question: ${question}\n\nPlease provide a comprehensive answer focused on mining compliance:`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Add disclaimer to every response
      return `${text}\n\n⚠️ **Disclaimer**: This AI-generated compliance advice is for informational purposes only. Please consult with qualified legal professionals for specific compliance matters.`;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate compliance response');
    }
  }

  async analyzeDocument(documentText: string): Promise<{
    summary: string;
    keyPoints: string[];
    complianceChecklist: string[];
  }> {
    try {
      const prompt = `${MINING_COMPLIANCE_CONTEXT}

Analyze the following mining-related document and provide:
1. A comprehensive summary
2. Key compliance points (as bullet points)
3. A compliance checklist for mining operations

Document content:
${documentText}

Please format your response as JSON with the following structure:
{
  "summary": "Comprehensive summary here",
  "keyPoints": ["Key point 1", "Key point 2", ...],
  "complianceChecklist": ["Checklist item 1", "Checklist item 2", ...]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Document analysis error:', error);
      throw new Error('Failed to analyze document');
    }
  }

  async generateComplianceTip(): Promise<string> {
    try {
      const prompt = `${MINING_COMPLIANCE_CONTEXT}

Generate a short, actionable compliance tip for mining operations. The tip should be:
- Practical and implementable
- Related to safety, environmental, or regulatory compliance
- Under 200 words
- Focused on South African mining context when applicable

Format: Just return the tip text without additional formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Tip generation error:', error);
      throw new Error('Failed to generate compliance tip');
    }
  }

  async summarizeNews(newsArticle: string): Promise<string> {
    try {
      const prompt = `${MINING_COMPLIANCE_CONTEXT}

Summarize the following mining-related news article, focusing on:
- Key regulatory changes
- Compliance implications
- Impact on mining operations
- Action items for mining companies

Keep the summary concise (under 300 words) and highlight compliance-relevant information.

Article:
${newsArticle}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('News summarization error:', error);
      throw new Error('Failed to summarize news article');
    }
  }

  async generateFAQAnswer(question: string): Promise<string> {
    try {
      const prompt = `${MINING_COMPLIANCE_CONTEXT}

Generate a comprehensive FAQ answer for the following mining compliance question:
"${question}"

The answer should be:
- Detailed and informative
- Include relevant regulations or standards when applicable
- Mention South African mining context when relevant
- Include practical implementation guidance
- Be suitable for publication as an FAQ entry`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return `${text}\n\n⚠️ **Disclaimer**: This information is for guidance only. Consult with qualified compliance professionals for specific regulatory requirements.`;
    } catch (error) {
      console.error('FAQ generation error:', error);
      throw new Error('Failed to generate FAQ answer');
    }
  }
}

export const geminiService = new GeminiService();
