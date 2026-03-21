import { build } from "esbuild";

// Bundle for Vercel Node.js Serverless — self-contained, Node.js built-ins external
await build({
  entryPoints: ["src/vercel.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.mjs",
  // Don't set external:[] — let platform:"node" auto-externalize Node.js built-ins
  // (http2, stream, crypto, etc.) while bundling all npm packages
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});

console.log("✅ API bundled to api/index.mjs (Vercel Node.js Serverless)");
