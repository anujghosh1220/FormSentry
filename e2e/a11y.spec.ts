import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (axe-core)', () => {
  test('dashboard axe results captured', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    // eslint-disable-next-line no-console
    console.log('DASHBOARD AXE VIOLATIONS:', results.violations.map(v => v.id + '(' + v.impact + ',' + v.nodes.length + ')'));
  });
});
