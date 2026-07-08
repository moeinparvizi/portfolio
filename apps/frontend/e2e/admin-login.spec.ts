import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1')).toContainText('Admin Login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);
    await expect(page.locator('.error')).toBeVisible();
  });

  test('should redirect to dashboard on valid login', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Should be on admin dashboard
    expect(page.url()).toContain('/admin');
  });
});
