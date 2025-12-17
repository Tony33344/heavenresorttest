import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

async function ensureEnglish(page: import('@playwright/test').Page) {
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (lang !== 'en') {
    // The header has a language toggle showing current language code (SL/EN)
    await page.getByRole('button', { name: /sl|en/i }).click();
    await expect.poll(async () => page.evaluate(() => document.documentElement.lang)).toBe('en');
  }
}

test('booking page shows login prompt when not authenticated', async ({ page }) => {
  await page.goto('/book');
  await ensureEnglish(page);
  await expect(page.getByText(/please sign in to make a booking/i)).toBeVisible();
});

test('authenticated user can create a booking', async ({ page }) => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_USER_EMAIL/TEST_USER_PASSWORD not provided');

  // Sign in first with return path
  await page.goto('/login?returnTo=/book');
  await ensureEnglish(page);
  await page.getByLabel('Email').fill(TEST_EMAIL!);
  await page.getByLabel('Password').fill(TEST_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Should land on /book and see calendar
  await expect(page).toHaveURL(/\/book/);

  // Pick the first enabled day button in the current calendar view
  const dayButton = page.locator('.rdp-day[aria-disabled="false"]').first();
  await dayButton.click();

  // Fill the form
  await page.getByLabel('Name').fill('E2E Booking User');
  await page.getByLabel('Email').fill(TEST_EMAIL!);
  await page.getByLabel('Phone').fill('+386 40 123 456');
  await page.getByLabel('Event Type').selectOption('wedding');
  await page.getByLabel('Guests').fill('25');
  await page.getByLabel('Message').fill('Booking created from Playwright E2E test.');

  await page.getByRole('button', { name: /submit booking/i }).click();

  await expect(page.getByText(/booking submitted/i)).toBeVisible();
});
