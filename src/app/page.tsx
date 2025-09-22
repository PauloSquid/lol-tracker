"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { champions as allChampions } from "@/lib/champion";

export default function HomePage() {
  const router = useRouter();
  const [checked, setChecked] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Vérifier session
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setUser(data.session.user);
      }
    };
    init();
  }, [router]);

  // Charger progression depuis Supabase
  useEffect(() => {
    const fetchProgression = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("progression")
        .select("champion_id")
        .eq("user_id", user.id);

      if (data) setChecked(data.map((c: any) => c.champion_id));
    };
    fetchProgression();
  }, [user]);

  // Toggle champion
  const toggleChampion = async (id: string) => {
    if (!user) return;

    const isChecked = checked.includes(id);
    setChecked((prev) =>
      isChecked ? prev.filter((c) => c !== id) : [...prev, id]
    );

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    await fetch("/api/progression", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        champion_id: id,
        checked: !isChecked,
      }),
    });
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const totalChampions = allChampions.length;
  const checkedCount = checked.length;
  const progress = (checkedCount / totalChampions) * 100;

  // Filtrer les champions selon la recherche
  const champions = allChampions.filter((champ) =>
    champ.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-6">
      <div className="w-full max-w-7xl bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-10">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-wide">
            LoL Top1 Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition font-semibold"
          >
            Logout
          </button>
        </header>

        {/* Stats */}
        <div className="w-full max-w-lg mb-4 mx-auto">
          <div className="flex justify-between mb-1 text-sm font-semibold text-gray-300">
            <span>
              {checkedCount} / {totalChampions} champions validés
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-5 bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="w-full max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Rechercher un champion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Grille */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {champions.map((champ) => {
            const isChecked = checked.includes(champ.id);
            return (
              <div
                key={champ.id}
                onClick={() => toggleChampion(champ.id)}
                className={`relative flex flex-col items-center p-2 rounded-lg cursor-pointer transition transform
                  ${
                    isChecked
                      ? "bg-green-800 border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.7)] scale-100"
                      : "bg-gray-800 hover:border-green-400 hover:shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:scale-105"
                  }`}
              >
                <Image
                  src={champ.icon}
                  alt={champ.id}
                  width={64}
                  height={64}
                  unoptimized
                  className={`rounded-md transition ${isChecked ? "opacity-40" : ""}`}
                />
                <span className="text-xs mt-2">{champ.id}</span>

                {isChecked && (
                  <span className="absolute top-1 right-1 text-green-400 text-xl font-bold">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
