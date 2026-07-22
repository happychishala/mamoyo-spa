import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // The treatment menu now lives under the Spa section.
      { source: "/treatments", destination: "/spa/menu", permanent: true },
      { source: "/treatments/:path*", destination: "/spa/menu", permanent: true },
      // Historic salon / barber URLs point at the spa.
      { source: "/salon", destination: "/spa", permanent: true },
      { source: "/salon/:path*", destination: "/spa", permanent: true },
      { source: "/barber", destination: "/spa", permanent: true },
      { source: "/barber/:path*", destination: "/spa", permanent: true },
    ];
  },
};

export default nextConfig;
