/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/log-9x4qz2',
        destination: '/submit',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
