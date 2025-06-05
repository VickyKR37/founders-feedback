
"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ServerCrash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Global Error Boundary Caught:", error);
  }, [error]);

  // Determine if it's likely a Firebase configuration issue based on keywords or if it's a server-originated error.
  // error.digest is often present for errors that originate on the server and are passed to the client error boundary.
  let isLikelyServerOrFirebaseConfigError = !!error.digest; // Assume server error if digest exists
  if (!isLikelyServerOrFirebaseConfigError) {
    if (error.message.includes("Firebase") || error.message.includes("NEXT_PUBLIC_FIREBASE_API_KEY")) {
      isLikelyServerOrFirebaseConfigError = true;
    }
    if (error.stack && (error.stack.includes("firebase.ts") || error.stack.includes("user-context.tsx"))){
      isLikelyServerOrFirebaseConfigError = true;
    }
  }


  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <ServerCrash className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl">Application Error</CardTitle>
          <CardDescription>
            We're sorry, but something went wrong.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This might be a temporary issue. You can try to refresh the page or click the button below.
          </p>
          {isLikelyServerOrFirebaseConfigError && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-left">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-destructive">Potential Server-Side or Firebase Configuration Issue</h4>
                  <p className="text-sm text-destructive/90 mt-1">
                    This error often indicates a problem with the server environment, frequently related to Firebase setup. Please:
                  </p>
                  <ul className="list-disc list-inside text-sm text-destructive/90 mt-1 pl-2 space-y-0.5">
                    <li>
                      <strong>Check Server Logs:</strong> Review the logs for your application in Google Cloud Logging (specifically for the 'founders-feedback' App Hosting / Cloud Run service). Look for messages from "[FirebaseSetup]" or other specific error details.
                    </li>
                    <li>
                      <strong>Verify Environment Variables:</strong> Ensure that <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> and other <code>NEXT_PUBLIC_FIREBASE_...</code> variables are correctly set with the proper values in your deployed application's environment (Firebase App Hosting / Cloud Run service configuration).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
           <p className="text-xs text-muted-foreground pt-2">
            Error details: {error.message} (Digest: {error.digest || 'N/A'})
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => reset()} size="lg">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

