import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xzivcqbzwwetyrrkazll.supabase.co",
      },
    ],
  },
};

export default nextConfig;
