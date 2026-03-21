import { build } from "esbuild";

// Bundle for Vercel Edge Runtime — everything into one self-contained file
await build({
  entryPoints: ["src/vercel.ts"],
  bundle: true,
  platform: "browser",
  target: "es2022",
  format: "esm",
  outfile: "api/index.mjs",
  external: [],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("✅ API bundled to api/index.mjs (self-contained for Vercel Edge)");
