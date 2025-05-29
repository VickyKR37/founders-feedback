
"use client";

import type { BetaTestOffer } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Tag, UserCircle, DollarSign } from 'lucide-react';

interface BetaTestOfferCardProps {
  offer: BetaTestOffer;
}

export function BetaTestOfferCard({ offer }: BetaTestOfferCardProps) {
  const problemPreview = offer.mvpProblem.length > 100 ? offer.mvpProblem.substring(0, 97) + "..." : offer.mvpProblem;
  const solutionPreview = offer.mvpSolution.length > 100 ? offer.mvpSolution.substring(0, 97) + "..." : offer.mvpSolution;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl leading-tight">{offer.title}</CardTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm">
            <CardDescription className="flex items-center">
                <UserCircle className="w-4 h-4 mr-1.5 text-muted-foreground" />
                By {offer.founderName}
            </CardDescription>
            <CardDescription className="flex items-center font-semibold">
                <DollarSign className="w-4 h-4 mr-1.5 text-primary" />
                Price: {offer.price}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-1">MVP Problem:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{problemPreview}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">MVP Solution:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{solutionPreview}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-1.5" />
          {offer.applicantCount || 0} applicants
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/beta-tests/${offer.id}`}>View Offer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
