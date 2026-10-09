import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  images:{
    qualities: [75, 100],
  },
};

module.exports = {
  allowedDevOrigins: ['192.168.56.1'],
}

export default nextConfig;
