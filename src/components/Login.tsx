"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage("Erreur lors de l'envoi du code.");
    else {
      setStep("otp");
      setMessage(`Un code a été envoyé à ${email}.`);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "magiclink", // Supabase utilise le type magiclink pour le code OTP aussi
    });
    if (error || !data.session) setMessage("Code invalide, réessayez.");
    else router.replace("/"); // connecté
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-10 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-emerald-400 text-center">LoL Top1 Tracker</h1>

        {step === "email" ? (
          <>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={sendOtp}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition font-semibold"
            >
              Recevoir le code
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Entrez le code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={verifyOtp}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition font-semibold"
            >
              Vérifier le code
            </button>
          </>
        )}

        {message && <p className="text-center text-sm text-gray-300">{message}</p>}
      </div>
    </main>
  );
}
