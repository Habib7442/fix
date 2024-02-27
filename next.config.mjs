/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["foorweb.net", "foorweb-backend.sfo3.digitaloceanspaces.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: ["**.sfo3.digitaloceanspaces.com", "**.foorweb.net"],
    //   },
    // ],
  },
};

export default nextConfig;
