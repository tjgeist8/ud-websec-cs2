/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: [],
  ...(process.env.NODE_ENV === "development" && {
    experimental: {
      serverActions: {
        allowedOrigins: ["localhost:3000"]
      }
    }
  })
};

module.exports = nextConfig;
