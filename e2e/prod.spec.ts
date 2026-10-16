import { test } from '@playwright/test';

test('prod dashboard + logo', async ({ page }) => {
  await page.goto('https://form-sentry-rouge.vercel.app/');
  await page.screenshot({ path: 'e2e/screenshots/prod-dashboard.png', fullPage: true });
});
