import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "content": path.resolve(__dirname, "./src/Content"),
      "Content": path.resolve(__dirname, "./src/Content"),
    },
  },
});
