
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Rocket } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signUp } = useUser(); // Using mocked signIn
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(data.email, data.password);
        toast({
          title: "Account Created!",
          description: "You have successfully signed up. Please sign in.",
        });
        setIsSignUp(false); // Switch to sign-in form after successful sign-up
        reset(); // Reset form fields
      } else {
        await signIn(data.email, data.password);
        toast({
          title: "Signed In!",
          description: "Welcome back!",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(isSignUp ? "Sign up error:" : "Sign in error:", error);
      toast({
        title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
        description: error.message || (isSignUp ? "Could not create account. Please try again." : "Invalid email or password. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">{isSignUp ? "Create an Account" : "Sign In"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Enter your email and password to sign up." : "Enter your credentials to access your account."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button variant="link" type="button" onClick={() => { setIsSignUp(!isSignUp); reset(); }} className="p-0 h-auto font-semibold text-primary">
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
