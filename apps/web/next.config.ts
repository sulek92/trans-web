import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async rewrites() {
    return [
      {
        source: '/icons/icon-192x192.png',
        destination: '/next.svg',
      },
      {
        source: '/icons/icon-512x512.png',
        destination: '/next.svg',
      },
    ];
  },
};

export default nextConfig;
