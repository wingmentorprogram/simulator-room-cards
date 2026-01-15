export interface CardData {
  id: string;
  title: string;
  type: 'solid' | 'image';
  src?: string; // For images
  color?: string; // For solid colors
  promptContext: string; // Context for Gemini
  description: string; // Longer poetic description
}

export interface GenerationResult {
  title: string;
  content: string;
}