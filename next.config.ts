import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/satx-ai.html",
        destination: "/satx-ai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
