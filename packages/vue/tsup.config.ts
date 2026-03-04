import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: { resolve: ["@loyalops/web-core"] },
    sourcemap: true,
    clean: true,
    external: ["vue", "@tanstack/vue-query"],
    noExternal: ["@loyalops/web-core"],
    treeshake: true,
    minify: false,
    splitting: false,
});
