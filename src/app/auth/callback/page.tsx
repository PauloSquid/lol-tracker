"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const url = new URL(window.location.href);
      const access_token = url.searchParams.get("access_token");
      const refresh_token = url.searchParams.get("refresh_token");

      if (access_token && refresh_token) {
        // Mettre la session dans Supabase pour la PWA
        await supabase.auth.setSession({ access_token, refresh_token });
        router.replace("/"); // Redirige vers la page principale
      } else {
        router.replace("/login"); // En cas de problème
      }
    };

    handleAuth();
  }, [router]);

  return <p>Connexion en cours...</p>;
}
