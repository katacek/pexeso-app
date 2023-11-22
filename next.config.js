/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region, 
  }
}

module.exports = nextConfig
