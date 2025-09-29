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
        await signIn.social(Object.assign(
          {
            provider: "google",
            callbackURL: "/dashboard",
          },
          // Pass provider-specific OAuth params without using `any`
          { options: { authorizationParams: { prompt: "select_account" as const } } } as Record<string, unknown>
        ));
      }}
    >
      Sign in
    </Button>
  );
}
