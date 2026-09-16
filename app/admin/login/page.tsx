"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, LogIn, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";

const GENERIC_ERROR = "Invalid email or password.";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Firebase authenticates the actual credential first; the backend
      // never sees the password, only the ID token it verifies server-side.
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const destination = searchParams.get("from") || "/admin";
      router.push(destination);
      router.refresh();
    } catch (err) {
      // Firebase throws its own error codes (wrong password, no such user,
      // etc.) — collapse all of them to one generic message, same as before,
      // so a failed login never reveals whether the email exists.
      const code = (err as { code?: string })?.code;
      if (code && code.startsWith("auth/")) {
        setError(GENERIC_ERROR);
      } else {
        setError("Couldn't reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <div className="absolute inset-0 bg-linear-to-br from-[#FF6A3D]/15 via-transparent to-[#6D5DF6]/25" aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-card border border-white/10 bg-surface p-8 shadow-card-hover">
        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6] shadow-glow-primary">
            <ShieldCheck className="size-6 text-white" />
          </span>
          <h1 className="font-heading text-xl font-bold text-foreground">Faraz Mart Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in with your administrator account.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="admin-email" required>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Password" htmlFor="admin-password" required>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {error && (
            <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                <LogIn className="size-4.5" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
