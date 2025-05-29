
"use client";

import type { Idea } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserCircle } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const problemPreview = idea.problem.length > 100 ? idea.problem.substring(0, 97) + "..." : idea.problem;
  const solutionPreview = idea.solution.length > 100 ? idea.solution.substring(0, 97) + "..." : idea.solution;
  
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl leading-tight">{idea.title}</CardTitle>
        <CardDescription className="flex items-center text-sm pt-1">
          <UserCircle className="w-4 h-4 mr-1.5 text-muted-foreground" />
          By {idea.founderName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-1">The Problem:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{problemPreview}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Our Solution:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{solutionPreview}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4 mr-1.5" />
          {idea.commentCount || 0} comments
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/ideas/${idea.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
