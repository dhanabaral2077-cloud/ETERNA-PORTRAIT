export type PortfolioItem = {
  id: string;
  title: string;
  src: string;
  aiHint: string;
};

export const portfolioData: PortfolioItem[] = [
  { id: '1', title: 'Regal Beagle', src: '/portfolio/portrait_01.jpg', aiHint: 'dog portrait' },
  { id: '2', title: 'Persian Prince', src: '/portfolio/pet_03.jpg', aiHint: 'cat portrait' },
  { id: '3', title: 'Golden Days', src: '/portfolio/golden_retriever.jpg', aiHint: 'golden retriever' },
  { id: '4', title: 'Shadowy Tabby', src: '/portfolio/tabby_cat.jpg', aiHint: 'tabby cat' },
  { id: '5', title: 'Majestic Shepherd', src: '/portfolio/german_shepherd.jpg', aiHint: 'german shepherd' },
  { id: '6', title: 'Playful Pup', src: '/portfolio/puppy_portrait.jpg', aiHint: 'puppy portrait' },
];
