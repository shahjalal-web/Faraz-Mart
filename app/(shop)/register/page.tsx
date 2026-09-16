"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserPlus } from "lucide-react";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useCustomerAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() && !phone.trim()) {
      setError("Enter an email or a phone number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email: email.trim() || undefined, phone: phone.trim() || undefined, password });
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async (idToken: string) => {
    setError(null);
    try {
      await loginWithGoogle(idToken);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6] shadow-glow-primary">
            <ShieldCheck className="size-6 text-white" />
          </span>
          <h1 className="font-heading text-xl font-bold text-foreground">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Join Faraz Mart in a few seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Full Name" htmlFor="name" required>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>

          <FormField label="Email" htmlFor="reg-email">
            <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>

          <FormField label="Phone Number" htmlFor="reg-phone">
            <Input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>

          <FormField label="Password" htmlFor="reg-password" required>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          <FormField label="Confirm Password" htmlFor="reg-confirm-password" required>
            <Input
              id="reg-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>

          {error && (
            <p role="alert" className="rounded-button bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : (
              <>
                <UserPlus className="size-4.5" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton onIdToken={handleGoogle} onError={() => setError("Google sign-in failed.")} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
