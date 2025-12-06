/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.balloonlightprag.cz',
      },
    ],
  },
}

export default nextConfig
