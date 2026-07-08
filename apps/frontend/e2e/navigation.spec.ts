import { test, expect } from '@playwright/test';

test.describe('Public Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Portfolio/);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href*="about"]');
    await expect(page.url()).toContain('/about');
  });

  test('should navigate to skills page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href*="skills"]');
    await expect(page.url()).toContain('/skills');
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href*="projects"]');
    await expect(page.url()).toContain('/projects');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href*="contact"]');
    await expect(page.url()).toContain('/contact');
  });
});

test.describe('Language Switching', () => {
  test('should switch to Farsi', async ({ page }) => {
    await page.goto('/en');
    await page.click('button:has-text("FA")');
    await expect(page.url()).toContain('/fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('should switch to German', async ({ page }) => {
    await page.goto('/en');
    await page.click('button:has-text("DE")');
    await expect(page.url()).toContain('/de');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle dark/light mode', async ({ page }) => {
    await page.goto('/en');
    const toggle = page.locator('button[aria-label*="mode"]');

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');

    // Toggle
    await toggle.click();

    // Check theme changed
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });
});
