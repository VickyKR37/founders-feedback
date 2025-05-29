
"use client";

import type { BetaTestOffer } from '@/types';
import { BetaTestOfferCard } from '@/components/beta-tests/beta-test-offer-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Lightbulb, Search } from "lucide-react";
import { Input } from '@/components/ui/input';

// Mock data for beta test offers
const mockBetaTestOffers: BetaTestOffer[] = [
  {
    id: 'bt1',
    founderId: 'founder1',
    founderName: 'Alice Wonderland',
    title: 'Beta Test: AI Story Generator Pro Features',
    mvpProblem: 'Users of our free story generator want more control, longer stories, and genre choices.',
    mvpSolution: 'Introducing Pro features: genre selection (sci-fi, fantasy, adventure), story length up to 2000 words, and character customization options.',
    price: '$5 for Beta Access (includes 3 months Pro post-launch)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    applicantCount: 8,
  },
  {
    id: 'bt2',
    founderId: 'founder2',
    founderName: 'Bob The Builder',
    title: 'Early Access: Smart Urban Farming Kit v1',
    mvpProblem: 'Testing the core functionality of our smart sensors and the usability of the companion app for beginners.',
    mvpSolution: 'A basic kit with one planter, soil moisture sensor, and a mobile app with step-by-step planting guides for 3 common herbs.',
    price: 'Free (feedback required)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    applicantCount: 15,
  },
];

export default function BetaTestsPage() {
  const [offers, setOffers] = useState<BetaTestOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, fetch beta test offers from a backend/Firebase
    setOffers(mockBetaTestOffers);
  }, []);

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.mvpProblem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.mvpSolution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">Beta Testing Opportunities</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Help shape the future of new products by becoming a beta tester, or offer your MVP for valuable feedback.
        </p>
        <Button size="lg" asChild>
          <Link href="/beta-tests/new">
            <Lightbulb className="mr-2 h-5 w-5" /> Post Beta Test Offer
          </Link>
        </Button>
      </section>

      <Alert className="border-accent text-accent-foreground bg-accent/10">
        <CheckCircle className="h-5 w-5 !text-accent" />
        <AlertTitle className="font-semibold">Validate with Real Users!</AlertTitle>
        <AlertDescription>
          Offering your beta test, even for a nominal price, is a powerful way to gauge true user interest and validate demand. Paying users provide the strongest signal!
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search beta tests..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Available Beta Tests</h2>
        {filteredOffers.length === 0 ? (
          <p className="text-muted-foreground text-center py-5">
            {searchTerm ? "No beta tests match your search." : "No beta test offers available at the moment. Check back soon!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOffers.map((offer) => (
              <BetaTestOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

