import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  
  async getImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }).then((base64data) => base64data.split(',')[1]);  // Return only the base64 string
    } catch (error) {
      throw new Error('Failed to convert image to Base64');
    }
  }
  

  async generateRecipe(imageBase64: string, prompt: string, model: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(environment.apiKey);
    const genModel = genAI.getGenerativeModel({ model });
  
    const result = await genModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageBase64 
              } 
            },
            { text: prompt }
          ]
        }
      ]
    });
  
    if (!result.response) {
      throw new Error('No response from AI');
    }
    
    return result.response.text();
  }
}