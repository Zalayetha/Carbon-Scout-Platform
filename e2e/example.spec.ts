import { test, expect } from "@playwright/test";

test.describe("Platform E2E Tests", () => {
  test("should load home page and verify platform header", async ({ page }) => {
    await page.goto("/");

    // Check main heading
    await expect(page.getByRole("heading", { name: "Carbon Scout Platform" })).toBeVisible();

    // Check subheading text
    await expect(
      page.getByText("Autonomous Carbon Market Intelligence & ESG Compliance Agent"),
    ).toBeVisible();

    // Check quick prompt buttons
    await expect(page.getByRole("button", { name: "🌿 Biochar Benchmarks 2025" })).toBeVisible();
  });

  test("should click prompt button and navigate to session chat route", async ({ page }) => {
    await page.goto("/");

    // Click prompt button
    await page.getByRole("button", { name: "🌿 Biochar Benchmarks 2025" }).click();

    // Submit form
    await page.getByRole("button", { name: "↑" }).click();

    // Expect navigation to /s/:id
    await expect(page).toHaveURL(/\/s\/[a-f0-9-]+/);

    // Verify chat header
    await expect(page.locator("header")).toContainText("Carbon Scout Platform");
  });
});
