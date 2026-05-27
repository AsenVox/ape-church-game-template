import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack uses this repo as the workspace root.
  // This avoids Next.js accidentally selecting a different lockfile (e.g. C:\\Users\\echom\\package-lock.json)
  // which can cause intermittent dev-server / module resolution issues.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
