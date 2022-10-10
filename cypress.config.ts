import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    viewportHeight: 900,
    viewportWidth: 1440,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});