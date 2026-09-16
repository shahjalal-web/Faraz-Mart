"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

/**
 * Verifies against Google directly (google-auth-library on the backend),
 * not through Firebase — see context/customer-auth-context.tsx and
 * back-end/src/routes/customer-auth.routes.ts for why.
 */
export function GoogleSignInButton({ onIdToken, onError }: { onIdToken: (idToken: string) => void; onError: () => void }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) onIdToken(credentialResponse.credential);
            else onError();
          }}
          onError={onError}
          width="320"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
