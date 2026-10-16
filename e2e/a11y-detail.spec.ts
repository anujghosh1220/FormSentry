import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dashboard axe detail', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const cc = results.violations.find(v => v.id === 'color-contrast');
  if (cc) {
    for (const node of cc.nodes) {
      // eslint-disable-next-line no-console
      console.log('NODE:', { html: node.html?.slice(0, 120), target: node.target, failureSummary: node.failureSummary });
    }
  }
  // eslint-disable-next-line no-console
  console.log('COUNT:', cc?.nodes?.length ?? 0);
});
