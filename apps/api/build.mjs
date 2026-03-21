import { build } from "esbuild";

await build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/bundle/app.mjs",
  external: [],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});

console.log("✅ API bundled to dist/bundle/app.mjs");
