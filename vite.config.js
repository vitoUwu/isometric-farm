import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  esbuild: {
    jsxImportSource: "jsx-dom",
    jsxInject: `import React from 'jsx-dom'`,
  },
});
