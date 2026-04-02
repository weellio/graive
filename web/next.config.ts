import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/admin/curriculum/import-local': ['./curriculum/**/*'],
    '/learn/**': ['./curriculum/**/*'],
  },
};

export default nextConfig;
