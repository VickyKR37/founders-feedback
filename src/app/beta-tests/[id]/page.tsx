
"use client";

import type { BetaTestOffer, BetaTestApplicant } from '@/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserPlus, Users, MessageSquare, DollarSign, UserCircle, CheckCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Mock data
const mockOfferDetails: BetaTestOffer = {
  id: 'bt1',
  founderId: 'founder1',
  founderName: 'Alice Wonderland',
  title: 'Beta Test: AI Story Generator Pro Features',
  mvpProblem: 'Users of our free story generator want more control, longer stories, and genre choices. Current free version is limited to 500 words and generic themes.',
  mvpSolution: 'Introducing Pro features for beta testing: genre selection (sci-fi, fantasy, adventure), story length up to 2000 words, and character customization options. Testers will get a special dashboard to generate and manage their stories.',
  price: '$5 for Beta Access (includes 3 months Pro post-launch)',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
};

const mockApplicants: BetaTestApplicant[] = [
  {
    id: 'app1',
    betaTestOfferId: 'bt1',
    testerId: 'testerUser1',
    testerName: 'Charlie Tester',
    testerEmail: 'charlie@example.com',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: 'applied',
  },
  {
    id: 'app2',
    betaTestOfferId: 'bt1',
    testerId: 'testerUser2',
    testerName: 'Dana Developer',
    testerEmail: 'dana@example.com',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'applied',
  },
];

// Mock server actions
async function volunteerForTestAction(offerId: string, userId: string, userName: string, userEmail: string | null): Promise<{ success: boolean; error?: string }> {
  console.log("Volunteering for test:", { offerId, userId, userName, userEmail });
  await new Promise(resolve => setTimeout(resolve, 500));
  // To simulate an error:
  // return { success: false, error: "Already volunteered or offer closed." };
  return { success: true };
}

export default function BetaTestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [offer, setOffer] = useState<BetaTestOffer | null>(null);
  const [applicants, setApplicants] = useState<BetaTestApplicant[]>([]);
  const [isVolunteering, setIsVolunteering] = useState(false);
  const [hasVolunteered, setHasVolunteered] = useState(false); // Mocked state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setTimeout(() => {
        if (id === mockOfferDetails.id) { // Check if mock data matches
            setOffer(mockOfferDetails);
            if (user && user.uid === mockOfferDetails.founderId) {
                 setApplicants(mockApplicants);
            }
            // Simulate checking if current user has volunteered
            if (user && mockApplicants.some(app => app.testerId === user.uid)) {
                setHasVolunteered(true);
            }
        } else {
            setOffer(null);
            toast({ title: "Beta test offer not found", variant: "destructive"});
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, user, toast]);

  const handleVolunteer = async () => {
    if (!user) {
      toast({ title: "Please sign in to volunteer.", variant: "destructive" });
      router.push('/auth/signin');
      return;
    }
    setIsVolunteering(true);
    try {
      const result = await volunteerForTestAction(id, user.uid, user.displayName || "User", user.email);
      if (result.success) {
        toast({ title: "Successfully volunteered!", description: "The founder will be notified." });
        setHasVolunteered(true); // Update UI
        // Potentially refetch applicants if this was a real list update
      } else {
        throw new Error(result.error || "Failed to volunteer.");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsVolunteering(false);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Lightbulb className="w-12 h-12 animate-pulse text-primary" /> 
        <p className="ml-3 text-lg">Loading beta test details...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Beta test offer not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/beta-tests"><ArrowLeft className="mr-2 h-4 w-4" />Back to offers</Link>
        </Button>
      </div>
    );
  }

  const isFounder = user && user.uid === offer.founderId;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10 p-6">
          <CardTitle className="text-3xl font-bold text-primary">{offer.title}</CardTitle>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-md">
            <CardDescription className="flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-muted-foreground" />
              Posted by {offer.founderName}
            </CardDescription>
            <CardDescription className="flex items-center font-semibold">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              Price: <Badge variant="secondary" className="ml-1.5 text-base">{offer.price}</Badge>
            </CardDescription>
          </div>
           <CardDescription className="text-sm pt-1">
            Offered on {new Date(offer.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">MVP Problem Statement</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{offer.mvpProblem}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">MVP Solution & Features for Testing</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{offer.mvpSolution}</p>
          </div>
        </CardContent>
        {!isFounder && user && (
          <CardFooter className="p-6 border-t">
            {hasVolunteered ? (
                <div className="flex items-center text-green-600 font-semibold p-3 bg-green-50 border border-green-200 rounded-md w-full">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    You have volunteered for this test! The founder may contact you.
                </div>
            ) : (
                <Button 
                  onClick={handleVolunteer} 
                  disabled={isVolunteering}
                  className="w-full md:w-auto text-lg py-6"
                  size="lg"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {isVolunteering ? 'Submitting...' : 'Volunteer to Test'}
                </Button>
            )}
          </CardFooter>
        )}
         {!user && !userLoading && (
            <CardFooter className="p-6 border-t">
                 <Alert>
                    <AlertTitle>Want to test this?</AlertTitle>
                    <AlertDescription>
                    <Link href={`/auth/signin?redirect=/beta-tests/${id}`} className="text-primary hover:underline font-semibold">Sign in</Link> or <Link href={`/auth/signin?signup=true&redirect=/beta-tests/${id}`} className="text-primary hover:underline font-semibold">sign up</Link> to volunteer.
                    </AlertDescription>
                </Alert>
            </CardFooter>
        )}
      </Card>

      {isFounder && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Users className="mr-3 h-6 w-6 text-primary"/>Beta Test Applicants</CardTitle>
            <CardDescription>Users interested in testing your MVP.</CardDescription>
          </CardHeader>
          <CardContent>
            {applicants.length > 0 ? (
              <ul className="space-y-4">
                {applicants.map((applicant) => (
                  <li key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${applicant.testerName.charAt(0)}`} alt={applicant.testerName} data-ai-hint="profile avatar" />
                        <AvatarFallback>{applicant.testerName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{applicant.testerName}</p>
                        <p className="text-sm text-muted-foreground">{applicant.testerEmail}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/messages/new?userId=${applicant.testerId}&userName=${encodeURIComponent(applicant.testerName)}`}> {/* Simplified DM link */}
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No applicants yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

