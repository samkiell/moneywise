import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || "admin@oaucowrywise.org";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || "devpassword123";

test.describe("Authentication and Route Protection", () => {
  test("Unauthenticated user is redirected to login from protected admin routes", async ({ page }) => {
    // Attempt visiting admin dashboard
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1")).toContainText("Money Wise Editorial CMS");

    // Attempt visiting publications desk
    await page.goto("/admin/publications");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Attempt visiting analytics desk
    await page.goto("/admin/analytics");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Login rejects invalid credentials with error message", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("input#email").fill("unauthorized@example.com");
    await page.locator("input#password").fill("wrongpassword");
    await page.getByRole("button", { name: /Sign In to CMS/i }).click();

    await expect(page.locator("text=Invalid email or password credentials.")).toBeVisible({ timeout: 10000 });
  });

  test("Admin login succeeds with valid test credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("input#email").fill(ADMIN_EMAIL);
    await page.locator("input#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Sign In to CMS/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText("Editorial Dashboard");
  });
});
