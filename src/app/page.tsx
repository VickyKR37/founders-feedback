
"use client";
import type { Idea } from '@/types';
import { IdeaCard } from '@/components/ideas/idea-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Mock data for ideas
const mockIdeas: Idea[] = [
  {
    id: '1',
    founderId: 'founder1',
    founderName: 'Alice Wonderland',
    title: 'AI-Powered Story Generator for Kids',
    problem: 'Parents struggle to find engaging and educational bedtime stories for their children. Existing options are often repetitive or not personalized.',
    solution: 'An AI platform that generates unique, personalized stories for children based on their interests, age, and learning goals. Stories can include interactive elements.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    commentCount: 12,
  },
  {
    id: '2',
    founderId: 'founder2',
    founderName: 'Bob The Builder',
    title: 'Sustainable Urban Farming Kits',
    problem: 'City dwellers lack space and knowledge to grow their own food, leading to reliance on store-bought produce with a high carbon footprint.',
    solution: 'Compact, modular farming kits designed for balconies and small urban spaces, complete with smart sensors and an app for guidance.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    commentCount: 5,
  },
  {
    id: '3',
    founderId: 'founder3',
    founderName: 'Charlie Brown',
    title: 'Personalized Language Learning Chatbot',
    problem: 'Learning a new language is hard and often lacks real-world conversation practice. Tutors can be expensive.',
    solution: 'An AI chatbot that simulates real conversations in various languages, adapting to the user\'s proficiency level and providing instant feedback.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    commentCount: 23,
  },
];


export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    // In a real app, fetch ideas from a backend/Firebase
    setIdeas(mockIdeas);
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">Welcome to Founder Feedback</h1>
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
        {ideas.length === 0 ? (
          <p className="text-muted-foreground">No ideas posted yet. Be the first!</p>
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
