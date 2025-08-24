'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { getArtSuggestions } from '@/app/actions';
import { portfolioData } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  artworkDescription: z.string().min(10, { message: 'Please describe your desired artwork in at least 10 characters.' }),
  message: z.string().optional(),
});

export function Contact() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', artworkDescription: '', message: '' },
  });

  const handleSuggestion = () => {
    const description = form.getValues('artworkDescription');
    if (!description || description.trim().length < 10) {
      form.setError("artworkDescription", { type: "manual", message: "Please enter at least 10 characters to get suggestions." });
      return;
    }

    const formData = new FormData();
    formData.append('artworkDescription', description);
    
    startTransition(async () => {
      setSuggestionError(null);
      setSuggestions(null);
      const result = await getArtSuggestions(formData);
      if (result.error) {
        setSuggestionError(result.error);
      } else {
        setSuggestions(result.suggestions || []);
      }
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message Sent!',
      description: "Thank you for your interest. We'll be in touch shortly!",
    });
    form.reset();
    setSuggestions(null);
    setSuggestionError(null);
  }

  const suggestedArtworks = suggestions ? portfolioData.filter(item => suggestions.includes(item.filename)) : [];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-primary">Commission Your Portrait</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Ready to start? Fill out the form below. For style ideas, try our AI assistant!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Full Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} className="py-6 text-base" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email Address</FormLabel>
                    <FormControl><Input placeholder="your.email@example.com" {...field} className="py-6 text-base" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="artworkDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Describe Your Desired Artwork</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'A classic oil painting style of my golden retriever, with a playful expression, set in a green field.'" {...field} rows={4} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
                
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Additional Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other details, like preferred size or deadline." {...field} rows={4} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" size="lg" className="text-lg flex-1">Send Commission Request</Button>
                <Button type="button" variant="outline" size="lg" className="text-lg flex-1 border-accent text-accent hover:bg-accent/10 hover:text-accent" onClick={handleSuggestion} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
                  AI Style Suggestion
                </Button>
              </div>
            </form>
          </Form>

          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold font-headline mb-4 text-primary">Style Suggestions</h3>
            <div className="space-y-4">
              {isPending && (
                <div className="flex items-center justify-center p-8 bg-background rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {suggestionError && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{suggestionError}</AlertDescription>
                </Alert>
              )}
              {suggestions && suggestions.length === 0 && !suggestionError && (
                 <Alert>
                  <AlertTitle>No specific matches found</AlertTitle>
                  <AlertDescription>We couldn't find a perfect match, but feel free to browse our full portfolio for inspiration!</AlertDescription>
                </Alert>
              )}
              {suggestedArtworks.length > 0 && (
                <div className="space-y-4">
                  {suggestedArtworks.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                           <Image src={item.src} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.aiHint}/>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.filename}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {!suggestions && !isPending && !suggestionError && (
                <div className="p-6 bg-background rounded-lg text-center">
                  <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Describe your idea above and click the "AI Style Suggestion" button to get inspired by our portfolio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
