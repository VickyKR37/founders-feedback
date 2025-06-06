
"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ServerCrash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ErrorBoundaryForRouteSegments({ // Renamed component for clarity, was GlobalError
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Route Segment Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <ServerCrash className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl">Application Error</CardTitle>
          <CardDescription>
            We're sorry, but something went wrong. You encountered an error while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This might be a temporary issue. You can try to refresh the page or click the button below.
            If the problem persists, it might be due to a server-side issue.
          </p>
          
          {/* Always show this detailed troubleshooting advice for errors caught by this boundary */}
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-left">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-destructive">Critical: Investigate Server-Side Logs & Configuration</h4>
                <p className="text-sm text-destructive/90 mt-1">
                  An error occurred on the server. The details are NOT in this browser message. You MUST check your server logs:
                </p>
                <ul className="list-disc list-inside text-sm text-destructive/90 mt-2 space-y-1">
                  <li>
                    <strong>Check Server Logs in Google Cloud Logging:</strong>
                    <ol className="list-decimal list-inside pl-4 mt-1 text-xs">
                      <li>Go to the Google Cloud Console.</li>
                      <li>Navigate to your Firebase project (`founders-feedback`).</li>
                      <li>Go to "Logging" &gt; "Logs Explorer".</li>
                      <li>Filter for logs from your Cloud Run service (this is your App Hosting backend, likely named `founders-feedback`).</li>
                      <li>Look for **ERROR level logs** around the time the error occurred.</li>
                      <li>Pay close attention to messages from `[FirebaseSetup]` (these are from `src/lib/firebase.ts`) which can pinpoint Firebase initialization failures (e.g., "CRITICAL ERROR: Firebase API Key... is missing").</li>
                    </ol>
                  </li>
                  <li>
                    <strong>Verify Environment Variables:</strong> Ensure that <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> and other <code>NEXT_PUBLIC_FIREBASE_...</code> variables are correctly set with the proper values in your deployed application's environment (Firebase App Hosting / Cloud Run service configuration in the Google Cloud Console). These variables are essential for Firebase to work on the server.
                  </li>
                </ul>
                <p className="text-xs text-destructive/80 mt-2">
                  The actual error message from the server logs is crucial for diagnosing this issue.
                </p>
              </div>
            </div>
          </div>
           <p className="text-xs text-muted-foreground pt-2">
            Error details (client-side perspective): {error.message} (Digest for server correlation: {error.digest || 'N/A'})
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

