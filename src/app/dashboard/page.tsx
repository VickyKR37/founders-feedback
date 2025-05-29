
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Idea, BetaTestOffer } from '@/types';
import { useUser } from '@/context/user-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Edit3, Users, PlusCircle, PackageOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

// Mock data
const mockUserIdeas: Idea[] = [
  { id: 'myIdea1', founderId: 'mockUserId', founderName: 'Test User', title: 'My Revolutionary To-Do App', problem: '...', solution: '...', createdAt: new Date(), commentCount: 5 },
  { id: 'myIdea2', founderId: 'mockUserId', founderName: 'Test User', title: 'Eco-Friendly Packaging Solution', problem: '...', solution: '...', createdAt: new Date(), commentCount: 12 },
];

const mockUserBetaOffers: BetaTestOffer[] = [
  { id: 'myOffer1', founderId: 'mockUserId', founderName: 'Test User', title: 'Beta: To-Do App Premium', mvpProblem: '...', mvpSolution: '...', price: '$2 Early Bird', createdAt: new Date(), applicantCount: 3 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
  const [myBetaOffers, setMyBetaOffers] = useState<BetaTestOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/auth/signin?redirect=/dashboard');
      return;
    }

    // Simulate fetching user-specific data
    setIsLoading(true);
    setTimeout(() => {
      // Filter mock data as if it was fetched for the current user
      setMyIdeas(mockUserIdeas.filter(idea => idea.founderId === user.uid));
      setMyBetaOffers(mockUserBetaOffers.filter(offer => offer.founderId === user.uid));
      setIsLoading(false);
    }, 500);

  }, [user, userLoading, router]);

  if (userLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Loading dashboard...</p></div>;
  }

  if (!user) {
     // Fallback, should be caught by useEffect but good for safety
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Redirecting to sign in...</p></div>;
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.email}!</h1>
        <div className="flex gap-2">
            <Button asChild>
                <Link href="/ideas/new"><PlusCircle className="mr-2 h-4 w-4" /> Post New Idea</Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/beta-tests/new"><PackageOpen className="mr-2 h-4 w-4" /> Offer Beta Test</Link>
            </Button>
        </div>
      </div>
      <Separator/>

      {/* My Ideas Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><Lightbulb className="mr-3 h-6 w-6 text-primary"/>My Ideas</CardTitle>
          <CardDescription>Manage your posted business ideas.</CardDescription>
        </CardHeader>
        <CardContent>
          {myIdeas.length === 0 ? (
            <p className="text-muted-foreground">You haven't posted any ideas yet. <Link href="/ideas/new" className="text-primary hover:underline">Post your first idea!</Link></p>
          ) : (
            <ul className="space-y-4">
              {myIdeas.map(idea => (
                <li key={idea.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-lg">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground">Posted on: {new Date(idea.createdAt).toLocaleDateString()} - {idea.commentCount} comments</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/ideas/${idea.id}`}><Edit3 className="mr-2 h-4 w-4"/>View/Edit</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* My Beta Test Offers Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><PackageOpen className="mr-3 h-6 w-6 text-primary"/>My Beta Test Offers</CardTitle>
          <CardDescription>Manage your beta test offers and view applicants.</CardDescription>
        </CardHeader>
        <CardContent>
          {myBetaOffers.length === 0 ? (
            <p className="text-muted-foreground">You haven't posted any beta test offers. <Link href="/beta-tests/new" className="text-primary hover:underline">Offer your MVP for testing!</Link></p>
          ) : (
            <ul className="space-y-4">
              {myBetaOffers.map(offer => (
                <li key={offer.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">Price: {offer.price} - {offer.applicantCount} applicants</p>
                  </div>
                   <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/beta-tests/${offer.id}`}><Users className="mr-2 h-4 w-4"/>View Applicants</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      {/* Messages Section Placeholder */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><MessageSquare className="mr-3 h-6 w-6 text-primary"/>My Messages</CardTitle>
          <CardDescription>Communicate with beta testers and community members.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">You have no new messages.</p>
            <Button variant="link" asChild className="p-0 mt-2">
                <Link href="/messages">Go to Messages</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
