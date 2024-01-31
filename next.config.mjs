/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
    images: {
        domains: ['ipfs.io', 'orange-real-wildfowl-609.mypinata.cloud'],
      },
};

export default nextConfig;
