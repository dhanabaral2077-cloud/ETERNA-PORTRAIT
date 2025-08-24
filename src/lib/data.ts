export type PortfolioItem = {
  id: string;
  title: string;
  src: string;
  aiHint: string;
};

export const portfolioData: PortfolioItem[] = [
  { id: '1', title: 'Regal Beagle', src: 'https://placehold.co/600x800.png', aiHint: 'dog portrait' },
  { id: '2', title: 'Persian Prince', src: 'https://placehold.co/600x800.png', aiHint: 'cat portrait' },
  { id: '3', title: 'Golden Days', src: 'https://placehold.co/600x800.png', aiHint: 'golden retriever' },
  { id: '4', title: 'Shadowy Tabby', src: 'https://placehold.co/600x800.png', aiHint: 'tabby cat' },
  { id: '5', title: 'Majestic Shepherd', src: 'https://placehold.co/600x800.png', aiHint: 'german shepherd' },
  { id: '6', title: 'Playful Pup', src: 'https://placehold.co/600x800.png', aiHint: 'puppy portrait' },
];
