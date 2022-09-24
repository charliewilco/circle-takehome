/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};
