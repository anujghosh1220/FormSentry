import { test, expect } from '@playwright/test';

const FIELD_TEMPLATE = (id: string) => ({
  id,
  title: 'Imported Form',
  description: '',
  fields: [{ id: 'f1', type: 'text', label: 'Name', required: false, order: 0 }],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  version: 1,
});

test.describe('Storage + import/export', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('multiple forms persist independently after reload', async ({ page }) => {
    const author = async (title: string) => {
      await page.getByRole('button', { name: /Author a form/i }).first().click();
      await page.getByLabel(/Form name/i).fill(title);
      await page.getByRole('button', { name: /Create form/i }).click();
      await expect(page.getByText(/Add fields from the library/i)).toBeVisible({ timeout: 15000 });
      await page.getByRole('link', { name: /FormSentry/i }).click();
    };
    await author('Alpha');
    await author('Beta');
    // dashboard shows both
    await expect(page.getByText('Alpha').first()).toBeVisible();
    await expect(page.getByText('Beta').first()).toBeVisible();
    await page.reload();
    await expect(page.getByText('Alpha').first()).toBeVisible();
    await expect(page.getByText('Beta').first()).toBeVisible();
  });

  test('malformed localStorage does not crash the app shell', async ({ page }) => {
    // inject then go home
    await page.evaluate(() => { localStorage.setItem('formsentry_forms', '{not json'); window.location.reload(); });
    // wait out
    await page.waitForTimeout(1500);
    // app should still render without the dashboard crashing white
    await expect(page.locator('#root')).toBeVisible();
  });
});
