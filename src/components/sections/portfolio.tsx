'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { portfolioData, PortfolioItem } from '@/lib/data';

export function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

  const renderPortfolioGrid = (items: PortfolioItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {items.map((item) => (
        <Dialog key={item.id} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogTrigger asChild>
            <Card
              className="overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => setSelectedImage(item)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={item.aiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                   <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-bold text-white transition-all duration-300 group-hover:text-primary-foreground">{item.title}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
           {selectedImage && selectedImage.id === item.id && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary font-headline">{selectedImage.title}</DialogTitle>
                <DialogDescription>A beautiful custom portrait.</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video w-full mt-4">
                <Image src={selectedImage.src} alt={selectedImage.title} layout="fill" objectFit="contain" data-ai-hint={selectedImage.aiHint}/>
              </div>
            </DialogContent>
           )}
        </Dialog>
      ))}
    </div>
  );

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-primary">Our Masterpieces</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Browse a selection of our favorite commissions. Each portrait is a unique story of love and companionship.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mx-auto max-w-md h-auto">
            <TabsTrigger value="all" className="py-2 text-md">All</TabsTrigger>
            <TabsTrigger value="dogs" className="py-2 text-md">Dogs</TabsTrigger>
            <TabsTrigger value="cats" className="py-2 text-md">Cats</TabsTrigger>
            <TabsTrigger value="other" className="py-2 text-md">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-10">
            {renderPortfolioGrid(portfolioData)}
          </TabsContent>
          <TabsContent value="dogs" className="mt-10">
            {renderPortfolioGrid(portfolioData.filter((p) => p.type === 'dog'))}
          </TabsContent>
          <TabsContent value="cats" className="mt-10">
            {renderPortfolioGrid(portfolioData.filter((p) => p.type === 'cat'))}
          </TabsContent>
          <TabsContent value="other" className="mt-10">
            {renderPortfolioGrid(portfolioData.filter((p) => p.type === 'other'))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
