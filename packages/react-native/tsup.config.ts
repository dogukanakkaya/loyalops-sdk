import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: { resolve: ["@loyalops/react"] },
    sourcemap: true,
    clean: true,
    external: ["react", "react-native", "@tanstack/react-query"],
    noExternal: ["@loyalops/react"],
    treeshake: true,
    minify: false,
    splitting: false,
});
