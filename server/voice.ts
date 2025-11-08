// Voice processing with AssemblyAI and Gemini AI
// Integration blueprint: javascript_gemini
import { AssemblyAI } from 'assemblyai';
import { GoogleGenAI } from '@google/genai';
import type { InsertInventoryItem } from '../shared/schema';

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || '',
});

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export interface VoiceProcessingResult {
  transcript: string;
  items: Array<InsertInventoryItem>;
}

/**
 * Transcribe audio file using AssemblyAI
 */
async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const transcript = await assemblyai.transcripts.transcribe({
      audio: audioBuffer,
    });

    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    return transcript.text || '';
  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Parse transcribed text using Gemini to extract inventory items
 */
async function parseInventoryItems(transcript: string): Promise<Array<InsertInventoryItem>> {
  try {
    const systemPrompt = `You are an inventory management assistant. Extract grocery/inventory items from the user's speech.
For each item mentioned, extract:
- name: The item name (e.g., "apples", "milk", "rice")
- quantity: The number of units (default to 1 if not specified)
- category: The category (e.g., "Fruits", "Dairy", "Grains", "Vegetables", "Meat", "Beverages", "Snacks", "Other")
- location: Storage location (default to "Pantry" unless specified, could be "Fridge", "Freezer", "Counter", etc.)
- reorderThreshold: A reasonable minimum stock level (default to 5 for most items, 10 for staples like rice/flour)

Examples:
Input: "Add 5 apples and 2 bottles of milk"
Output: [
  {"name": "apples", "quantity": 5, "category": "Fruits", "location": "Counter", "reorderThreshold": 5},
  {"name": "milk", "quantity": 2, "category": "Dairy", "location": "Fridge", "reorderThreshold": 5}
]

Input: "I need to add rice, chicken, and 3 oranges"
Output: [
  {"name": "rice", "quantity": 1, "category": "Grains", "location": "Pantry", "reorderThreshold": 10},
  {"name": "chicken", "quantity": 1, "category": "Meat", "location": "Fridge", "reorderThreshold": 5},
  {"name": "oranges", "quantity": 3, "category": "Fruits", "location": "Counter", "reorderThreshold": 5}
]

Respond with a JSON array of items. If no items are found, return an empty array.`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              quantity: { type: 'number' },
              category: { type: 'string' },
              location: { type: 'string' },
              reorderThreshold: { type: 'number' },
            },
            required: ['name', 'quantity', 'category', 'location', 'reorderThreshold'],
          },
        },
      },
      contents: transcript,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      return [];
    }

    const items = JSON.parse(rawJson) as Array<InsertInventoryItem>;
    return items;
  } catch (error) {
    console.error('Gemini parsing error:', error);
    throw new Error('Failed to parse inventory items');
  }
}

/**
 * Process voice input: transcribe and parse inventory items
 */
export async function processVoiceInput(audioBuffer: Buffer): Promise<VoiceProcessingResult> {
  const transcript = await transcribeAudio(audioBuffer);
  const items = await parseInventoryItems(transcript);
  
  return {
    transcript,
    items,
  };
}
