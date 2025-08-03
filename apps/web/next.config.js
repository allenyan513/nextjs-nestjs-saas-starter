const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-east-2.amazonaws.com',
      },
    ],
  }
};
// module.exports = {
//   reactStrictMode: true,
//   transpilePackages: ["@repo/ui"],
//   output: "standalone",
//   experimental: {
//     outputFileTracingRoot: path.join(__dirname, "../../"),
//   },
// };
export default nextConfig;
