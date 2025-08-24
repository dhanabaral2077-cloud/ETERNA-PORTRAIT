"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getArtSuggestions } from '@/app/actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { portfolioData } from '@/lib/data';
import type { PortfolioItem } from '@/lib/data';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      size="lg" 
      className="w-full text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 hover:shadow-xl hover:shadow-amber-400/50 transition-all rounded-full"
      disabled={pending}
    >
      {pending ? 'Getting suggestions...' : 'Get Style Suggestions'}
    </Button>
  );
}

export function CTA() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getArtSuggestions, null);
  const [suggestedArt, setSuggestedArt] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
    if (state?.suggestions) {
      if (state.suggestions.length === 0) {
        toast({
          title: 'No suggestions found',
          description: 'We couldn\'t find any matching artwork in our portfolio. Please try a different description.',
        });
        setSuggestedArt([]);
      } else {
        const suggestedItems = portfolioData.filter(item => state.suggestions.includes(item.src.split('/').pop() || ''));
        setSuggestedArt(suggestedItems);
        toast({
          title: 'Suggestions Ready!',
          description: 'We found some artwork that might inspire you!',
        });
      }
    }
  }, [state, toast]);

  return (
    <section id="contact" className="py-20 lg:py-32 bg-card">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-background rounded-lg shadow-xl p-8 md:p-12 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4">Ready to Immortalize Your Pet?</h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground">
              Let's create a beautiful, lasting memory of your furry, feathery, or scaly friend. Describe your vision and we can suggest a style for you.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Your Name</Label>
                <Input id="name" name="name" placeholder="Enter your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Your Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="artworkDescription" className="text-base">Describe Your Desired Artwork</Label>
              <Textarea
                id="artworkDescription"
                name="artworkDescription"
                placeholder="e.g., 'A classic, regal portrait of my golden retriever, with a dark, moody background.'"
                rows={4}
                required
                minLength={10}
              />
              <p className="text-sm text-muted-foreground">Describe the style, mood, and subject. Our AI will suggest matching pieces from our portfolio!</p>
            </div>

            <div className="text-center pt-4">
              <SubmitButton />
            </div>
          </form>

          {suggestedArt.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-headline text-center mb-8">Inspired by Your Vision</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedArt.map((item) => (
                  <div key={item.id} className="rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                     <Image
                        src={item.src}
                        alt={item.title}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                        data-ai-hint={item.aiHint}
                      />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
