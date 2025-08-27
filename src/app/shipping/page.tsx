// src/app/shipping/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PackageCheck, Ship, XCircle, Check, ChevronsUpDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { countries, Country } from '@/lib/countries'; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"


type ShipmentMethod = {
  shipmentMethodUid: string;
  type: 'normal' | 'express' | 'pallet';
  name: string;
  hasTracking: boolean;
};

function CountryCombobox({ selectedCountry, onCountryChange }: { selectedCountry: string, onCountryChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-lg py-6"
        >
          {selectedCountry
            ? countries.find((country) => country.code === selectedCountry)?.name
            : "Select your country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    onCountryChange(country.code === selectedCountry ? "" : country.code)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function ShippingPage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [shipmentMethods, setShipmentMethods] = useState<ShipmentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipmentMethods = async (countryCode: string) => {
    if (!countryCode) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/shipping-methods?country=${countryCode}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch data.');
      }
      const data = await response.json();
      setShipmentMethods(data.shipmentMethods || []);
    } catch (err: any) {
      setError(err.message);
      setShipmentMethods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    fetchShipmentMethods(countryCode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
             <Ship className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="font-headline text-4xl md:text-5xl text-foreground">Shipping & Delivery</h1>
            <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
              We ship globally to bring your masterpiece to your doorstep. Select your country to see available shipping options.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-12">
             <CountryCombobox selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
             <Alert variant="destructive" className="max-w-lg mx-auto">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && selectedCountry && shipmentMethods.length > 0 && (
            <div className="bg-card p-6 rounded-2xl shadow-lg border">
                <h2 className="font-headline text-2xl mb-4 text-center text-foreground">
                    Available Methods for {countries.find(c => c.code === selectedCountry)?.name}
                </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead className="text-center">Tracking</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentMethods.map((method) => (
                    <TableRow key={method.shipmentMethodUid}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell className="capitalize">{method.type}</TableCell>
                      <TableCell className="text-center">
                        {method.hasTracking ? (
                            <PackageCheck className="h-6 w-6 text-green-500 inline-block" />
                        ) : (
                            <XCircle className="h-6 w-6 text-red-500 inline-block" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !error && selectedCountry && shipmentMethods.length === 0 && (
             <Alert className="max-w-lg mx-auto">
                <AlertTitle>No Methods Found</AlertTitle>
                <AlertDescription>
                    We could not find any specific shipping methods for the selected country. We do offer general international shipping.
                </AlertDescription>
            </Alert>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}