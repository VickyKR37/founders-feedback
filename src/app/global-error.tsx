
"use client"; // Error components must be Client Components

import { useEffect } from 'react';

// Minimal styling to avoid issues with CSS loading in a broken state
const errorStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#fef2f2', // Light red background
  color: '#991b1b', // Dark red text
};

const cardStyles: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  border: '1px solid #fecaca', // Red border
};

const headingStyles: React.CSSProperties = {
  fontSize: '24px',
  color: '#b91c1c', // Even darker red for heading
  marginBottom: '10px',
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '10px',
  color: '#52525b', // Neutral text color for readability
};

const codeStyles: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  color: '#1f2937',
};

const buttonStyles: React.CSSProperties = {
  backgroundColor: '#dc2626', // Red button
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '20px',
};

const listStyles: React.CSSProperties = {
  textAlign: 'left',
  paddingLeft: '20px',
  marginBottom: '10px',
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GlobalError Boundary Caught:", error);
  }, [error]);

  return (
    <html>
      <head>
        <title>Application Error</title>
      </head>
      <body>
        <div style={errorStyles}>
          <div style={cardStyles}>
            <h1 style={headingStyles}>Application Error</h1>
            <p style={paragraphStyles}>
              We're sorry, but something went wrong. You might be seeing an "Internal Server Error".
            </p>
            
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '18px', color: '#b91c1c', marginBottom: '10px' }}>
                🔴 Critical: Investigate Server-Side Logs & Configuration
              </h2>
              <p style={paragraphStyles}>
                An "Internal Server Error" or similar critical failure usually means a problem occurred on the server. The details are NOT in this browser message. You MUST check your server logs:
              </p>
              <ul style={listStyles}>
                <li style={paragraphStyles}>
                  <strong>Check Server Logs in Google Cloud Logging:</strong>
                  <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', marginTop: '5px' }}>
                    <li style={paragraphStyles}>Go to the Google Cloud Console.</li>
                    <li style={paragraphStyles}>Navigate to your Firebase project (e.g., <code style={codeStyles}>founders-feedback</code>).</li>
                    <li style={paragraphStyles}>Go to "Logging" &gt; "Logs Explorer".</li>
                    <li style={paragraphStyles}>Filter for logs from your Cloud Run service (this is your App Hosting backend, likely named <code style={codeStyles}>founders-feedback</code>).</li>
                    <li style={paragraphStyles}>Look for <strong>ERROR level logs</strong> around the time the error occurred.</li>
                    <li style={paragraphStyles}>Pay close attention to messages from <code style={codeStyles}>[FirebaseSetup]</code> (these are from <code style={codeStyles}>src/lib/firebase.ts</code>) which can pinpoint Firebase initialization failures (e.g., "CRITICAL ERROR: Firebase API Key... is missing").</li>
                  </ol>
                </li>
                <li style={paragraphStyles}>
                  <strong>Verify Environment Variables:</strong> Ensure that <code style={codeStyles}>NEXT_PUBLIC_FIREBASE_API_KEY</code> and other <code style={codeStyles}>NEXT_PUBLIC_FIREBASE_...</code> variables are correctly set with the proper values in your deployed application's environment (Firebase App Hosting / Cloud Run service configuration in the Google Cloud Console).
                </li>
              </ul>
              <p style={{ ...paragraphStyles, fontSize: '12px', marginTop: '10px' }}>
                The actual error message from the server logs is crucial for diagnosing this issue.
              </p>
            </div>

            <p style={{ ...paragraphStyles, fontSize: '12px', marginTop: '15px', color: '#71717a' }}>
              Error details (client-side): {error?.message || 'No specific message available.'} 
              {error?.digest && (
                <> (Digest for server correlation: <code style={codeStyles}>{error.digest}</code>)</>
              )}
            </p>
            <button onClick={() => reset()} style={buttonStyles}>
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
