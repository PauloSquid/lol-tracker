import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LoL Top1 Tracker",
    short_name: "LoLTracker",
    description: "Track your arena champion progress in League of Legends 2v2",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a", // couleur sombre cohérente avec ton thème
    theme_color: "#34d399", // couleur verte émeraude pour le thème
    icons: [
      {
        src: "/favicon-192.png", // copie ton favicon existant ou crée une icône 192x192
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-512.png", // idem pour 512x512
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
