"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.replace("/");
    }
  };

  checkSession();

  // Ecouter les changements de session
  const { data: subscriptionData } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session) {
        router.replace("/");
      }
    }
  );

  return () => {
    subscriptionData.subscription.unsubscribe();
  };
}, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(`Erreur: ${error.message}`);
    } else {
      setMessage(
        "Vérifie ton e-mail pour te connecter ! Ouvre le lien directement dans ton appareil."
      );
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-emerald-400 mb-6">
          Connexion LoL Top1 Tracker
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Ton e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-400 text-black font-semibold py-2 rounded-md hover:bg-emerald-500 transition"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-300">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
