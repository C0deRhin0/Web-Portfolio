/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  devIndicators: false // disables the bottom-left "compiling/ready" UI
};

module.exports = nextConfig; 
