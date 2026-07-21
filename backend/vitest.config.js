import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Backend runs on Node, not a browser DOM.
    environment: "node",
    // Loaded before any test file — sets test env vars (JWT secret, etc.).
    setupFiles: ["./tests/setup/vitest.setup.js"],
    // Integration tests share one local MongoDB connection, so run test files
    // one at a time to avoid cross-file connection/teardown races.
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "controllers/**/*.js",
        "middleware/**/*.js",
        "routes/**/*.js",
        "utils/**/*.js",
      ],
    },
  },
});
