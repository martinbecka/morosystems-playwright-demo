import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  snapshotPathTemplate: './snapshots/{platform}/{testFileName}/{projectName}/{arg}{ext}',
  reporter: [['line'], ['html']],
  expect: {
    timeout: 30_000,
  },

  use: {
    baseURL: 'https://www.morosystems.cz',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'REST API',
      testMatch: '**/tests/rest/**/*.spec.ts',
      workers: 1,
      use: {
        baseURL: 'http://localhost:8080',
      },
    },
    {
      name: 'Firefox',
      testMatch: '**/tests/gui/**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'WebKit',
      testMatch: '**/tests/gui/**/*.spec.ts',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Edge',
      testMatch: '**/tests/gui/**/*.spec.ts',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Chrome',
      testMatch: '**/tests/gui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
