"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInButton()
{
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Button disabled>Loading...</Button>;
  }

  if (session) {
    return null;
  }

  return (
    <Button
      onClick={async () =>
      {
        await signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
          // Force Google to show the account chooser
          // Casting to any to pass provider-specific auth params safely
          ...({ options: { authorizationParams: { prompt: "select_account" } } } as any),
        });
      }}
    >
      Sign in
    </Button>
  );
}
