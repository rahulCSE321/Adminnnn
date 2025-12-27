// Gemini AI Service for Product Description and Disclaimer Generation

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
    candidates?: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

/**
 * Generate product description using Gemini AI
 */
export const generateProductDescription = async (
    productName: string,
    brand: string,
    category: string
): Promise<string | null> => {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
        return null;
    }

    try {
        const prompt = `Generate a compelling and detailed product description for an e-commerce grocery store. 
    
Product Details:
- Name: ${productName}
- Brand: ${brand}
- Category: ${category}

Requirements:
- Write 2-3 sentences
- Focus on key features, benefits, and quality
- Use professional, engaging language
- Highlight what makes this product special
- Keep it concise and informative

Generate only the description text, no additional formatting or labels.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data: GeminiResponse = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }

        return null;
    } catch (error) {
        console.error('Error generating product description:', error);
        return null;
    }
};

/**
 * Generate product disclaimer using Gemini AI
 */
export const generateDisclaimer = async (category: string): Promise<string | null> => {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
        return null;
    }

    try {
        const prompt = `Generate a professional product disclaimer for an e-commerce grocery store selling ${category} products.

Requirements:
- Keep it 1-2 sentences
- Cover accuracy of information and packaging differences
- Use standard e-commerce disclaimer language
- Be professional and clear
- Don't use quotation marks

Generate only the disclaimer text, no additional formatting or labels.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data: GeminiResponse = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }

        return null;
    } catch (error) {
        console.error('Error generating disclaimer:', error);
        return null;
    }
};
