import { createAuthClient } from "better-auth/react";

const runtimeBaseUrl =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: runtimeBaseUrl,
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
