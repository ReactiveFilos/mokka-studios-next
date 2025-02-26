/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
