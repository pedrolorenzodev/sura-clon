import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ?? "3100";
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/visual",
  snapshotPathTemplate: "{testDir}/__snapshots__/{arg}{ext}",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 240_000,
  expect: {
    timeout: 90_000,
    toHaveScreenshot: { maxDiffPixels: 0, threshold: 0, animations: "disabled", caret: "hide", scale: "device" },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    reducedMotion: "reduce",
    colorScheme: "dark",
    locale: "es-AR",
    timezoneId: "America/Argentina/Buenos_Aires",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
  ],
  webServer: { command: `npm run dev -- -p ${PORT}`, url: BASE_URL, reuseExistingServer: true, timeout: 120_000 },
});
