import { test, expect } from '@playwright/test';

test.describe('FormSentry smoke', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /validate themselves/i })).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'e2e/screenshots/dashboard-desktop.png', fullPage: true });
  });

  test('all routes load', async ({ page }) => {
    for (const path of ['/', '/templates', '/features']) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      await expect(page.locator('#root')).toBeVisible();
    }
  });

  test('mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/dashboard-mobile.png', fullPage: true });
  });
});
