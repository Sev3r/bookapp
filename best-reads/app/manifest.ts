import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Best Reads",
        short_name: "BR",
        description:
            "Discover new books based on ones you've read and track how much you've read over time.",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#f8ffceff",
        theme_color: "#408557ff",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
            {
                src: "/favicon.ico",
                sizes: "64x64 32x32 24x24 16x16",
                type: "image/x-icon",
            },
            {
                src: "/haveread.png"
            },
            {
                src: "/toread.png"
            }
        ],
        categories: ["books", "leisure", "tracking"],
    };
}