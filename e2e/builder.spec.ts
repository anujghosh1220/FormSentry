import { test, expect } from '@playwright/test';

test.describe('Form builder lifecycle', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    // ensure clean storage
    await page.evaluate(() => { localStorage.clear(); window.location.reload(); });
  });

  test('create form, add text field, edit, persist', async ({ page }) => {
    // Open author dialog
    await page.getByRole('button', { name: /Author a form/i }).first().click();
    const nameField = page.getByLabel(/Form name/i);
    await nameField.fill('My Audit Form');
    await page.getByRole('button', { name: /Create form/i }).click();

    // should navigate to builder with empty state
    await expect(page.getByText(/Add fields from the library/i)).toBeVisible({ timeout: 15000 });

    // add a short text field
    await page.getByRole('button', { name: /Short Text/i }).click();
    await expect(page.getByText('Field Properties')).toBeVisible();

    // edit label
    const labelInput = page.getByLabel('Field Label');
    await labelInput.fill('Your Name');
    await expect(page.getByLabel('Field Label')).toHaveValue('Your Name');

    // navigate to dashboard + reload builder
    await page.goto('/');
    // reopen form from dashboard
    await page.getByRole('button', { name: /Edit/i }).first().click();
    // select the field in the canvas so the properties panel opens
    await page.getByText('Your Name').first().click();
    await expect(page.getByLabel('Field Label')).toHaveValue('Your Name');
  });
});
