
"use client";

import type { Idea, Comment as CommentType } from '@/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, UserCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


// Mock data
const mockIdeaDetails: Idea = {
  id: '1',
  founderId: 'founder1',
  founderName: 'Alice Wonderland',
  title: 'AI-Powered Story Generator for Kids',
  problem: 'Parents struggle to find engaging and educational bedtime stories for their children. Existing options are often repetitive or not personalized. This leads to less enthusiasm for reading and missed learning opportunities. The market for childrens educational content is vast, but truly personalized and adaptive storytelling is a niche yet to be fully explored.',
  solution: 'An AI platform that generates unique, personalized stories for children based on their interests, age, and learning goals. Stories can include interactive elements, voice narration, and custom illustrations. The platform will use advanced NLP and machine learning models to adapt story complexity and themes dynamically. A subscription model is proposed with a free tier for basic story generation.',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
};

const mockComments: CommentType[] = [
  {
    id: 'c1',
    ideaId: '1',
    userId: 'user1',
    userName: 'Bookworm Parent',
    userAvatar: 'https://placehold.co/40x40.png?text=BP',
    text: "This sounds amazing! I'd definitely use this for my kids. How would you ensure age-appropriateness?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
  },
  {
    id: 'c2',
    ideaId: '1',
    userId: 'user2',
    userName: 'Tech Savvy Teacher',
    userAvatar: 'https://placehold.co/40x40.png?text=TT',
    text: "Interesting concept. The tech stack for dynamic illustration generation could be challenging. Have you considered using pre-made assets that AI can combine?",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
];

// Mock server action for posting comments
async function postCommentAction(ideaId: string, text: string, userId: string, userName: string): Promise<{ success: boolean; comment?: CommentType; error?: string }> {
  console.log("Posting comment:", { ideaId, text, userId, userName });
  await new Promise(resolve => setTimeout(resolve, 500));
  // To simulate an error:
  // return { success: false, error: "Failed to post comment." };
  const newComment: CommentType = {
    id: `mockComment${Date.now()}`,
    ideaId,
    userId,
    userName,
    userAvatar: 'https://placehold.co/40x40.png?text=U', // Placeholder avatar
    text,
    createdAt: new Date(),
  };
  return { success: true, comment: newComment };
}


export default function IdeaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Simulate fetching data
      setIsLoading(true);
      setTimeout(() => {
        // In a real app, fetch idea and comments by id
        if (id === mockIdeaDetails.id) { // Check if mock data matches the requested ID
          setIdea(mockIdeaDetails);
          setComments(mockComments);
        } else {
          // Handle idea not found, perhaps redirect or show an error
          setIdea(null); // Or redirect to a 404 page
          toast({ title: "Idea not found", variant: "destructive"});
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, toast]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast({ title: "Please sign in to comment.", variant: "destructive" });
      router.push('/auth/signin');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const result = await postCommentAction(id, newComment, user.uid, user.displayName || user.email || "Anonymous");
      if (result.success && result.comment) {
        setComments(prevComments => [result.comment!, ...prevComments]);
        setNewComment('');
        toast({ title: "Comment posted!" });
      } else {
        throw new Error(result.error || "Failed to post comment.");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Lightbulb className="w-12 h-12 animate-pulse text-primary" /> 
        <p className="ml-3 text-lg">Loading idea details...</p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Idea not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to ideas</Link>
        </Button>
      </div>
    );
  }

  const isFounder = user && user.uid === idea.founderId;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5 dark:bg-card-foreground/10 p-6">
          <CardTitle className="text-3xl font-bold text-primary">{idea.title}</CardTitle>
          <CardDescription className="text-md flex items-center pt-2">
            <UserCircle className="w-5 h-5 mr-2 text-muted-foreground" />
            Posted by {idea.founderName} on {new Date(idea.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">The Problem</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{idea.problem}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">The Solution</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{idea.solution}</p>
          </div>
        </CardContent>
        {isFounder && (
           <CardFooter className="p-6 border-t">
             <Button asChild className="w-full md:w-auto">
               <Link href={`/beta-tests/new?ideaId=${idea.id}&title=${encodeURIComponent(idea.title)}`}>
                 <Lightbulb className="mr-2 h-4 w-4" /> Offer Beta Test for this Idea
               </Link>
             </Button>
           </CardFooter>
        )}
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Community Feedback</CardTitle>
          <CardDescription>Share your thoughts and help refine this idea.</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <form onSubmit={handlePostComment} className="space-y-4 mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your feedback..."
                rows={4}
                className="focus:ring-primary focus:border-primary"
              />
              <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          ) : (
            <div className="text-center p-4 border rounded-md bg-muted/50">
              <p className="text-muted-foreground">
                <Link href="/auth/signin" className="text-primary hover:underline font-semibold">Sign in</Link> to join the discussion.
              </p>
            </div>
          )}
          
          <Separator className="my-6"/>

          <div className="space-y-6">
            {comments.length > 0 ? comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={comment.userAvatar} alt={comment.userName} data-ai-hint="profile avatar" />
                  <AvatarFallback>{comment.userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{comment.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            )) : (
              <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
