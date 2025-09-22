"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-2 text-center text-emerald-400">
          LoL 2v2 Tracker
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Connecte-toi avec ton email pour suivre ta progression.
        </p>

        {sent ? (
          <div className="text-center text-green-400 font-semibold">
            📩 Un lien de connexion a été envoyé à <br />
            <span className="text-white">{email}</span>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Ton email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-md bg-gray-800 border border-gray-600 focus:border-emerald-400 focus:ring focus:ring-emerald-400/30 outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 transition text-white font-semibold py-3 rounded-md shadow-md"
            >
              Se connecter
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </main>
  );
}
