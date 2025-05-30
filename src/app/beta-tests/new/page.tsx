
"use client";

import { useState, useEffect, Suspense } from "react"; // Added Suspense
import { useRouter, useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, Lightbulb } from "lucide-react"; // Added Lightbulb

const betaTestOfferSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be at most 100 characters."),
  mvpProblem: z.string().min(20, "MVP Problem description must be at least 20 characters.").max(1000),
  mvpSolution: z.string().min(20, "MVP Solution description must be at least 20 characters.").max(1000),
  price: z.string().min(1, "Price is required (e.g., 'Free', '$5 one-time', '$10/month subscription').").max(100),
  ideaId: z.string().optional(), // For linking to an existing idea
});

type BetaTestOfferFormData = z.infer<typeof betaTestOfferSchema>;

// Mock server action
async function createBetaTestOfferAction(data: BetaTestOfferFormData): Promise<{ success: boolean; offerId?: string; error?: string }> {
  console.log("Submitting beta test offer:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // To simulate an error:
  // return { success: false, error: "Failed to submit offer." };
  return { success: true, offerId: "newMockOfferId456" };
}

function NewBetaTestOfferForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This hook needs Suspense
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prefillIdeaId = searchParams.get('ideaId');
  const prefillTitle = searchParams.get('title');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BetaTestOfferFormData>({
    resolver: zodResolver(betaTestOfferSchema),
    defaultValues: {
      ideaId: prefillIdeaId || undefined,
      title: prefillTitle ? `Beta Test for: ${prefillTitle}` : '',
    }
  });

  useEffect(() => {
    if (prefillIdeaId) setValue('ideaId', prefillIdeaId);
    if (prefillTitle) setValue('title', `Beta Test for: ${prefillTitle}`);
  }, [prefillIdeaId, prefillTitle, setValue]);


  const onSubmit = async (data: BetaTestOfferFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a beta test offer.",
        variant: "destructive",
      });
      const baseRedirectPath = '/beta-tests/new';
      const currentSearchParamsString = searchParams.toString();
      const redirectPathWithParams = currentSearchParamsString ? `${baseRedirectPath}?${currentSearchParamsString}` : baseRedirectPath;
      router.push(`/auth/signin?redirect=${encodeURIComponent(redirectPathWithParams)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBetaTestOfferAction(data);
      if (result.success && result.offerId) {
        toast({
          title: "Beta Test Offer Posted!",
          description: "Your offer is now live for testers to see.",
        });
        reset();
        router.push(`/beta-tests/${result.offerId}`);
      } else {
        throw new Error(result.error || "Failed to post offer.");
      }
    } catch (error: any) {
      toast({
        title: "Error Posting Offer",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userLoading && !user) {
      const baseRedirectPath = '/beta-tests/new';
      const currentSearchParamsString = searchParams.toString();
      const redirectPathWithParams = currentSearchParamsString ? `${baseRedirectPath}?${currentSearchParamsString}` : baseRedirectPath;
      router.push(`/auth/signin?redirect=${encodeURIComponent(redirectPathWithParams)}`);
    }
  }, [user, userLoading, router, searchParams]);

  if (userLoading) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[300px]">
            <Lightbulb className="w-10 h-10 animate-pulse text-primary" />
            <p className="ml-2 mt-2">Loading user data...</p>
        </div>
    );
  }

  if (!user && !userLoading) {
     return (
        <div className="flex flex-col justify-center items-center min-h-[300px]">
            <Lightbulb className="w-10 h-10 animate-pulse text-primary" />
            <p className="ml-2 mt-2">Redirecting to sign in...</p>
        </div>
     );
  }

  return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Offer Your MVP for Beta Testing</CardTitle>
          <CardDescription>
            Get valuable feedback by offering your Minimum Viable Product to early adopters.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {prefillIdeaId && (
                <input type="hidden" {...register("ideaId")} />
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                placeholder="e.g., Early Access to SuperApp Pro"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mvpProblem">MVP Problem Statement</Label>
              <Textarea
                id="mvpProblem"
                placeholder="Clearly state the specific problem your MVP aims to solve for beta testers."
                {...register("mvpProblem")}
                rows={4}
                className={errors.mvpProblem ? "border-destructive" : ""}
              />
              {errors.mvpProblem && <p className="text-sm text-destructive">{errors.mvpProblem.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mvpSolution">MVP Solution / Features</Label>
              <Textarea
                id="mvpSolution"
                placeholder="Describe the core features of your MVP available for testing. What can testers do?"
                {...register("mvpSolution")}
                rows={4}
                className={errors.mvpSolution ? "border-destructive" : ""}
              />
              {errors.mvpSolution && <p className="text-sm text-destructive">{errors.mvpSolution.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price / "Cost" for Testers</Label>
              <Input
                id="price"
                placeholder="e.g., Free, $5 one-time, Feedback call"
                {...register("price")}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            
            <Alert className="border-accent text-accent-foreground bg-accent/10 mt-4">
              <DollarSign className="h-5 w-5 !text-accent" />
              <AlertTitle className="font-semibold">Validation Tip!</AlertTitle>
              <AlertDescription>
                Consider charging a small fee for your beta. It's a great way to test if users perceive real value in your solution early on. Even "skin in the game" like a detailed feedback survey can be a "price."
              </AlertDescription>
            </Alert>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Offer..." : "Post Beta Test Offer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
  );
}

export default function NewBetaTestOfferPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Suspense fallback={
          <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)]">
            <Lightbulb className="w-12 h-12 animate-pulse text-primary" />
            <p className="mt-4 text-lg">Loading beta test form...</p>
          </div>
        }>
        <NewBetaTestOfferForm />
      </Suspense>
    </div>
  );
}
