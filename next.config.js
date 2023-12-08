/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pexeso-bucket.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
