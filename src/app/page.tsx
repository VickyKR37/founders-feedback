
"use client";
import type { Idea } from '@/types';
import { IdeaCard } from '@/components/ideas/idea-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lightbulb } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ideasCollectionRef = collection(db, "ideas");
        const q = query(ideasCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedIdeas: Idea[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure createdAt is converted to Date if it's a Firestore Timestamp
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt);
          return {
            id: doc.id,
            founderId: data.founderId,
            founderName: data.founderName,
            title: data.title,
            problem: data.problem,
            solution: data.solution,
            createdAt: createdAt,
            commentCount: data.commentCount || 0,
          } as Idea;
        });
        setIdeas(fetchedIdeas);
      } catch (err: any) {
        console.error("Error fetching ideas:", err);
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
