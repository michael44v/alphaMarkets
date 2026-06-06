import { test, expect } from '@playwright/test';

test('final verification', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check rebranding
  const bodyText = await page.textContent('body');
  if (!bodyText.includes('AlphaWave Markets')) {
    throw new Error('AlphaWave Markets not found in body');
  }

  // Check promo text
  const promo = page.locator('text=Get 00 bonus for your first 000 deposit');
  await expect(promo).toBeVisible();

  await page.screenshot({ path: '/home/jules/verification/screenshots/final_verification.png', fullPage: true });
});
