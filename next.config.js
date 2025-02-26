/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "...",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: ["lucide-react"]
};

module.exports = nextConfig;
