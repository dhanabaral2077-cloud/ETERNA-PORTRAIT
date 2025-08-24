'use server';

import { suggestArtwork } from '@/ai/flows/suggest-artwork';
import { z } from 'zod';

const artworkDescriptionSchema = z.object({
  artworkDescription: z.string().min(10, 'Description must be at least 10 characters long.'),
});

export async function getArtSuggestions(formData: FormData) {
  const validatedFields = artworkDescriptionSchema.safeParse({
    artworkDescription: formData.get('artworkDescription'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.artworkDescription?.[0] || 'Invalid input.',
    };
  }
  
  try {
    const result = await suggestArtwork(validatedFields.data);
    return { suggestions: result.suggestedArtworks };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return {
      error: 'Failed to get suggestions. Please try again.',
    };
  }
}
