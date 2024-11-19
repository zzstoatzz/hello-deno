import { build } from "https://deno.land/x/esbuild@v0.20.1/mod.js";

// Build the main particle system module
await build({
  entryPoints: ['./components/particles/mod.ts'],
  outfile: './static/js/particles/mod.js',
  bundle: true,
  format: 'esm',
  sourcemap: true,
});

// We don't need to build init.ts separately since we're now including the initialization
// code directly in the particles view

Deno.exit(0); 