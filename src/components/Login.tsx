"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // Vérifier session au démarrage
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        router.replace("/"); // Redirige vers page principale si déjà connecté
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://ton-app.vercel.app/auth/callback",
      },
    });

    if (error) {
      setMessage("Erreur lors de l'envoi du Magic Link.");
    } else {
      setMessage(
        `Un email a été envoyé à ${email}. Cliquez sur le lien pour vous connecter.`
      );
    }
  };

  const refreshSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setUser(data.session.user);
      router.replace("/");
    } else {
      setMessage(
        "Aucune session détectée. Assurez-vous d'avoir cliqué sur le Magic Link."
      );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-10 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-emerald-400 text-center">
          LoL Top1 Tracker
        </h1>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button
          onClick={handleLogin}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition font-semibold"
        >
          Envoyer le Magic Link
        </button>

        {message && <p className="text-center text-sm text-gray-300">{message}</p>}

        <button
          onClick={refreshSession}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition font-semibold"
        >
          Vérifier la connexion
        </button>
      </div>
    </main>
  );
}
