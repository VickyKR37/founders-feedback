
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
// Removed Firestore imports: import { db } from "@/lib/firebase";
// Removed Firestore imports: import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be at most 100 characters."),
  problem: z.string().min(20, "Problem description must be at least 20 characters.").max(1000, "Problem description must be at most 1000 characters."),
  solution: z.string().min(20, "Solution description must be at least 20 characters.").max(1000, "Solution description must be at most 1000 characters."),
});

type IdeaFormData = z.infer<typeof ideaSchema>;

export default function NewIdeaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/signin?redirect=/ideas/new');
    }
  }, [user, userLoading, router]);

  const onSubmit = async (data: IdeaFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post an idea.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate successful idea posting for demo
      console.log("Simulating idea post:", {
        ...data,
        founderId: user.uid,
        founderName: user.displayName || user.email || "Anonymous User",
        createdAt: new Date(), // Use JavaScript Date
        commentCount: 0,
      });

      // Simulate a delay like a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDocId = `mockIdea_${Date.now()}`;

      toast({
        title: "Idea Posted! (Demo)",
        description: "Your idea has been successfully posted (this is a demo, not saved to DB).",
      });
      reset();
      router.push(`/ideas/${mockDocId}`); // Redirect to a mock idea page or homepage
    } catch (error: any) {
      console.error("Error posting idea (simulation):", error);
      toast({
        title: "Error Posting Idea (Demo)",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (userLoading || (!user && !userLoading)) { 
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>{userLoading ? "Loading user data..." : "Redirecting to sign in..."}</p></div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Post Your Business Idea</CardTitle>
          <CardDescription>
            Share your vision with the community. Clearly define the problem you're solving and your proposed solution.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Idea Title</Label>
              <Input
                id="title"
                placeholder="e.g., AI-Powered Personal Finance Advisor"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement</Label>
              <Textarea
                id="problem"
                placeholder="Describe the problem your idea solves. Who faces this problem? How significant is it?"
                {...register("problem")}
                rows={5}
                className={errors.problem ? "border-destructive" : ""}
              />
              {errors.problem && <p className="text-sm text-destructive">{errors.problem.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Proposed Solution</Label>
              <Textarea
                id="solution"
                placeholder="Explain your solution. How does it address the problem? What makes it unique?"
                {...register("solution")}
                rows={5}
                className={errors.solution ? "border-destructive" : ""}
              />
              {errors.solution && <p className="text-sm text-destructive">{errors.solution.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Post Idea"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
