import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["geist"],
  headers: async () => [
    {
      source: "/badges/:file*",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
      {
        protocol: "https",
        hostname: "archives.bulbagarden.net",
        pathname: "/media/upload/**",
      },
    ],
  },
};

export default nextConfig;
