import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["src/**/*.e2e-spec.ts"],
    exclude: ["node_modules", "data"],
    globals: true,
    root: "./",
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
