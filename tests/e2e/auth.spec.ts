import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Auth', () => {
  test('login and logout with test user (if credentials provided)', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_USER_EMAIL/TEST_USER_PASSWORD not provided');

    await page.goto('/login');

    // If language is SL, switch to EN for stable labels
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== 'en') {
      await page.getByRole('button', { name: /sl|en/i }).click();
      await expect.poll(async () => page.evaluate(() => document.documentElement.lang)).toBe('en');
    }

    await page.getByLabel('Email').fill(TEST_EMAIL!);
    await page.getByLabel('Password').fill(TEST_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Header should show user email
    await expect(page.getByText(TEST_EMAIL!)).toBeVisible();

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });
});
