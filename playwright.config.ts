import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { defineConfig, devices } from "@playwright/test";

const testPort = process.env.TEST_PORT || "3001";
const baseURL = process.env.TEST_BASE_URL || `http://localhost:${testPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 30000,
  use: {
    baseURL,
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
  webServer: {
    command: `node --env-file=.env node_modules/next/dist/bin/next start -p ${testPort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      NEXT_DIST_DIR: ".next-test",
      NODE_OPTIONS: "-r ./scripts/dns-preload.js",
      PORT: testPort,
      AUTH_URL: baseURL,
      NEXT_PUBLIC_APP_URL: baseURL,
    },
  },
});
