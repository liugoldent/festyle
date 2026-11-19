import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  ...(process.env.FESTYLE_STATIC_EXPORT === "true"
    ? { output: "export" as const, typescript: { tsconfigPath: "tsconfig.netlify.json" } }
    : {}),
};

export default nextConfig;
