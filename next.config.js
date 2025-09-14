/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  devIndicators: false, // disables the bottom-left "compiling/ready" UI
  allowedDevOrigins: ["192.168.119.1"],
};

module.exports = nextConfig; 