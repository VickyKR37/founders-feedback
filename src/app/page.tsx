
"use client";
import type { Idea } from '@/types';
import { IdeaCard } from '@/components/ideas/idea-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lightbulb } from "lucide-react";
// Removed Firestore imports: import { db } from '@/lib/firebase';
// Removed Firestore imports: import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

// Mock data for ideas
const mockIdeas: Idea[] = [
  {
    id: 'mock1',
    founderId: 'founderA',
    founderName: 'Demo Dave',
    title: 'Sustainable Dog Toy Subscription Box',
    problem: 'Pet owners want eco-friendly toys but find it hard to source them consistently. Existing subscription boxes often use plastic or non-sustainable materials.',
    solution: 'A monthly subscription box delivering curated, high-quality, and sustainable dog toys made from natural or recycled materials. Includes an option to return used toys for recycling.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    commentCount: 12,
  },
  {
    id: 'mock2',
    founderId: 'founderB',
    founderName: 'Sample Sally',
    title: 'AI-Powered Language Learning Pen Pal',
    problem: 'Language learners struggle to find consistent practice partners and receive instant feedback. Traditional apps can feel impersonal.',
    solution: 'An app that connects users with an AI pen pal. The AI adapts to the user\'s learning level, provides corrections, suggests vocabulary, and simulates natural conversation for immersive practice.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    commentCount: 7,
  },
  {
    id: 'mock3',
    founderId: 'founderC',
    founderName: 'Test Tina',
    title: 'Hyperlocal Skill-Sharing Platform',
    problem: 'People have skills they could teach or services they could offer locally, but there\'s no easy way to connect with neighbors who need them.',
    solution: 'A mobile platform where users can list skills they want to share/teach (e.g., gardening, coding, cooking) or request help. Focuses on very local, community-based exchanges.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
    commentCount: 3,
  }
];


export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setIdeas(mockIdeas); // Use mock data
      } catch (err: any) {
        console.error("Error fetching ideas (mock):", err);
        setError("Failed to fetch ideas. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">Welcome to Validly</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Share your startup ideas, get honest feedback, and find beta testers.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/ideas/new">Post Your Idea</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/beta-tests">Explore Beta Tests</Link>
          </Button>
        </div>
      </section>
      
      <Alert className="border-accent text-accent-foreground bg-accent/10">
        <Terminal className="h-5 w-5 !text-accent" />
        <AlertTitle className="font-semibold">Validation Focus!</AlertTitle>
        <AlertDescription>
          Remember, the best way to validate an idea is to find <strong className="font-semibold">paying users</strong>, even in the beta testing stage. Real commitment signals real value.
        </AlertDescription>
      </Alert>

      <section id="ideas">
        <h2 className="text-3xl font-semibold mb-6">Explore Startup Ideas</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Lightbulb className="w-8 h-8 animate-pulse text-primary mr-2" />
            <p className="text-muted-foreground">Loading ideas...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : ideas.length === 0 ? (
          <p className="text-muted-foreground text-center py-5">No ideas posted yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
