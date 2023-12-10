/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    AWS_BUCKET: process.env.AWS_BUCKET,
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
