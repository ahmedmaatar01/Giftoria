/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable Next/Image optimization for better performance
    unoptimized: false,
    // Allow loading images from local Laravel API domains
    domains: ["localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
