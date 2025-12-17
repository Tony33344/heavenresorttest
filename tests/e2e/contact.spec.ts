import { test, expect } from '@playwright/test';

const successTexts = [
  'Thank you! We will contact you soon.',
  'Hvala! Kmalu vas bomo kontaktirali.',
];

test('public contact inquiry submits successfully', async ({ page }) => {
  await page.goto('/');

  // Switch to English for stable assertions if currently in SL
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (lang !== 'en') {
    await page.getByRole('button', { name: /sl|en/i }).click();
    await expect.poll(async () => page.evaluate(() => document.documentElement.lang)).toBe('en');
  }

  await page.goto('/#contact');

  // Fill form
  await page.getByLabel('Name', { exact: false }).fill('E2E Test User');
  await page.getByLabel('Email', { exact: false }).fill(`e2e+${Date.now()}@example.com`);
  await page.getByLabel('Phone', { exact: false }).fill('+386 40 000 000');
  await page.getByLabel('Message', { exact: false }).fill('Public inquiry from Playwright test.');

  await page.getByRole('button', { name: /send|pošlji/i }).click();

  // Assert success in either language
  await expect(page.getByText(new RegExp(successTexts.join('|')))).toBeVisible();
});
