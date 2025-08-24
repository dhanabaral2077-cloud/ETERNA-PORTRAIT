import { type } from "os";

export type PortfolioItem = {
  id: string;
  title: string;
  type: 'dog' | 'cat' | 'other';
  src: string;
  filename: string;
  aiHint: string;
};

export const portfolioData: PortfolioItem[] = [
  { id: '1', title: 'Regal Beagle', type: 'dog', src: 'https://placehold.co/800/E2725B/F5F5DC.png', filename: 'portrait_01.jpg', aiHint: 'dog portrait' },
  { id: '2', title: 'Mountain Cat', type: 'cat', src: 'https://placehold.co/800/228B22/F5F5DC.png', filename: 'landscape_02.jpg', aiHint: 'cat landscape' },
  { id: '3', title: 'Bunny Buddy', type: 'other', src: 'https://placehold.co/800/E2725B/F5F5DC.png', filename: 'pet_03.jpg', aiHint: 'rabbit pet' },
  { id: '4', title: 'Abstract Aviary', type: 'other', src: 'https://placehold.co/800/228B22/F5F5DC.png', filename: 'abstract_04.jpg', aiHint: 'bird abstract' },
  { id: '5', title: 'Seaside Tabby', type: 'cat', src: 'https://placehold.co/800/E2725B/F5F5DC.png', filename: 'seascape_05.jpg', aiHint: 'cat seascape' },
  { id: '6', title: 'Golden Days', type: 'dog', src: 'https://placehold.co/800/228B22/F5F5DC.png', filename: 'portrait_02.jpg', aiHint: 'golden retriever' },
];

export type Testimonial = {
    id: string;
    name: string;
    pet: string;
    quote: string;
    avatar: string;
}

export const testimonialsData: Testimonial[] = [
    {
        id: '1',
        name: 'Sarah L.',
        pet: 'Max the Golden Retriever',
        quote: "I'm absolutely speechless. The portrait of Max captures his soul, not just his likeness. It's the most beautiful piece of art in our home.",
        avatar: 'SL'
    },
    {
        id: '2',
        name: 'Michael B.',
        pet: 'Luna the Siamese Cat',
        quote: "The entire process was so personal and professional. The final portrait of Luna is beyond my wildest dreams. The detail is just exquisite.",
        avatar: 'MB'
    },
    {
        id: '3',
        name: 'Jessica P.',
        pet: 'Rocky the Boxer',
        quote: "I commissioned this as a gift for my husband, and he was moved to tears. You've created a masterpiece that we will cherish forever. Thank you!",
        avatar: 'JP'
    },
    {
        id: '4',
        name: 'David C.',
        pet: 'Whiskers the Rabbit',
        quote: "I never thought a portrait could capture a rabbit's personality so well, but you did it! It's whimsical, detailed, and so full of life.",
        avatar: 'DC'
    }
];
