import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

async function ensureEnglish(page: import('@playwright/test').Page) {
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (lang !== 'en') {
    await page.getByRole('button', { name: /sl|en/i }).click();
    await expect.poll(async () => page.evaluate(() => document.documentElement.lang)).toBe('en');
  }
}

test('admin redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login\?returnTo=(%2Fadmin|\/admin)/);
  await ensureEnglish(page);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});

test('admin dashboard loads for authenticated user', async ({ page }) => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_USER_EMAIL/TEST_USER_PASSWORD not provided');

  await page.goto('/login?returnTo=/admin');
  await ensureEnglish(page);

  await page.getByLabel('Email').fill(TEST_EMAIL!);
  await page.getByLabel('Password').fill(TEST_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByText(/admin dashboard/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /bookings/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /contact messages/i })).toBeVisible();
});
