import { test, expect } from '@playwright/test';

test.describe('Platform E2E Tests', () => {
  test('should load home page and render notes from API', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Platform App' })).toBeVisible();

    // Check notes list section heading
    await expect(page.getByRole('heading', { name: 'Notes List' })).toBeVisible();

    // Verify notes fetched from Hono API are displayed on page
    await expect(page.getByText('My First Note')).toBeVisible();
    await expect(page.getByText('Monorepo Setup')).toBeVisible();
  });
});

