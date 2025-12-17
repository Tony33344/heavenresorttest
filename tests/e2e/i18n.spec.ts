import { test, expect } from '@playwright/test';

test('language toggle updates <html lang>', async ({ page }) => {
  await page.goto('/');

  const initialLang = await page.evaluate(() => document.documentElement.lang);
  await page.getByRole('button', { name: /sl|en/i }).click();
  await expect.poll(async () => page.evaluate(() => document.documentElement.lang)).not.toBe(initialLang);
});
