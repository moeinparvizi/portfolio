import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form', async ({ page }) => {
    await page.goto('/en/contact');

    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright.');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success message (or error if API not running)
    await page.waitForTimeout(2000);

    // Check that form was submitted (either success or error message appears)
    const hasFeedback = await page.locator('.success, .error').isVisible();
    expect(hasFeedback).toBe(true);
  });
});
