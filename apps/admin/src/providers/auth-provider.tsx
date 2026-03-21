"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

const ALLOWED_EMAILS = (
  process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ||
  process.env.ALLOWED_ADMIN_EMAILS ||
  "ilhamram332@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        router.push("/login");
        return;
      }

      const email = session.user.email?.toLowerCase();
      if (!email || !ALLOWED_EMAILS.includes(email)) {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login?error=unauthorized");
        return;
      }

      setUser(session.user);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        router.push("/login");
        return;
      }

      const email = session.user.email?.toLowerCase();
      if (!email || !ALLOWED_EMAILS.includes(email)) {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login?error=unauthorized");
        return;
      }

      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router, setUser, setLoading]);

  return <>{children}</>;
}
