'use server';
/**
 * @fileOverview An AI agent that suggests relevant artwork pieces from the artist's portfolio based on customer's description.
 *
 * - suggestArtwork - A function that handles the artwork suggestion process.
 * - SuggestArtworkInput - The input type for the suggestArtwork function.
 * - SuggestArtworkOutput - The return type for the suggestArtwork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestArtworkInputSchema = z.object({
  artworkDescription: z
    .string()
    .describe('The description of the desired artwork style and subject.'),
});
export type SuggestArtworkInput = z.infer<typeof SuggestArtworkInputSchema>;

const SuggestArtworkOutputSchema = z.object({
  suggestedArtworks: z
    .array(z.string())
    .describe(
      'A list of suggested artwork filenames from the artist portfolio that matches the description.'
    ),
});
export type SuggestArtworkOutput = z.infer<typeof SuggestArtworkOutputSchema>;

export async function suggestArtwork(input: SuggestArtworkInput): Promise<SuggestArtworkOutput> {
  return suggestArtworkFlow(input);
}

const getPortfolioFilenames = ai.defineTool({
  name: 'getPortfolioFilenames',
  description: 'Retrieves a list of available artwork filenames from the artist portfolio.',
  inputSchema: z.object({}),
  outputSchema: z.array(z.string()),
},
async () => {
  // In a real implementation, this would fetch the filenames from storage or database.
  // For this example, we return some dummy data.
  return [
    'portrait_01.jpg',
    'pet_03.jpg',
    'golden_retriever.jpg',
    'tabby_cat.jpg',
    'german_shepherd.jpg',
    'puppy_portrait.jpg'
  ];
});

const suggestArtworkPrompt = ai.definePrompt({
  name: 'suggestArtworkPrompt',
  tools: [getPortfolioFilenames],
  input: {schema: SuggestArtworkInputSchema},
  output: {schema: SuggestArtworkOutputSchema},
  prompt: `You are an expert art consultant who specializes in understanding customer art preferences and matching them with available artwork pieces.

  The customer is describing their desired artwork style and subject. Based on their description, you will suggest relevant pieces from the artist's existing portfolio.

  Here's the customer's description: {{{artworkDescription}}}

  First, use the getPortfolioFilenames tool to get a list of available artwork filenames from the artist portfolio.
  Then, select the artworks from the portfolio that best match the customer's description and include them in the suggestedArtworks output array.
  If no artworks match the description, return an empty array.

  Ensure that the suggestedArtworks array only contains filenames that are returned by the getPortfolioFilenames tool.
  Do not include any filenames that are not in the portfolio.
  Do not make up or hallucinate any filenames.
  `,
});

const suggestArtworkFlow = ai.defineFlow(
  {
    name: 'suggestArtworkFlow',
    inputSchema: SuggestArtworkInputSchema,
    outputSchema: SuggestArtworkOutputSchema,
  },
  async input => {
    const {output} = await suggestArtworkPrompt(input);
    return output!;
  }
);
