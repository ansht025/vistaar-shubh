/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  allowedDevOrigins: ['172.21.240.1']
};

module.exports = nextConfig;

