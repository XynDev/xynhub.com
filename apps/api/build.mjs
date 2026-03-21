import { build } from "esbuild";

// Bundle for Vercel serverless — everything into one self-contained file
await build({
  entryPoints: ["src/vercel.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  external: [],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});

console.log("✅ API bundled to api/index.mjs (self-contained for Vercel)");
