import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
