import { test, expect } from "@playwright/test";

test.describe("Public Magazine Flows", () => {
  test("Homepage loads with branding, navigation, and core sections", async ({ page }) => {
    await page.goto("/");

    // Branding and tagline
    await expect(page.locator("text=MONEY WISE").first()).toBeVisible();
    await expect(page.locator("text=We write to inform. We create to inspire. We publish to empower.").first()).toBeVisible();

    // Navigation links
    const nav = page.locator("header nav");
    await expect(nav.getByRole("link", { name: "Stories" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Tabloids" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Meet the Team" })).toBeVisible();

    // Core sections
    await expect(page.locator("text=Recent Publications")).toBeVisible();
    await expect(page.locator("text=Five Community Pillars")).toBeVisible();
    await expect(page.locator("text=Stay Updated with Money Wise")).toBeVisible();
  });

  test("Publication navigation loads Stories and Story Detail", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.locator("h1")).toContainText("Stories");

    // Look for seeded story link if present, or assert archive structure
    const storyLink = page.locator("a[href*='/stories/']").first();
    if (await storyLink.count() > 0) {
      await storyLink.click();
      await expect(page.locator("article")).toBeVisible();
      await expect(page.locator("text=Back to Stories")).toBeVisible();
    }
  });

  test("Publication navigation loads Tabloids and Tabloid Detail", async ({ page }) => {
    await page.goto("/tabloids");
    await expect(page.locator("h1")).toContainText("Tabloids");

    // Look for seeded tabloid link if present
    const tabloidLink = page.locator("a[href*='/tabloids/']").first();
    if (await tabloidLink.count() > 0) {
      await tabloidLink.click();
      await expect(page.locator("article")).toBeVisible();
      await expect(page.locator("text=Back to Tabloids")).toBeVisible();
    }
  });

  test("Masthead page displays editorial team", async ({ page }) => {
    await page.goto("/team");
    await expect(page.locator("h1")).toContainText("Meet the Editorial Team");
    await expect(page.locator("text=Chief Editor")).toBeVisible();
  });

  test("About page displays Money Wise overview and pillars", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("Money Wise Magazine");
    await expect(page.locator("text=Financial Literacy").first()).toBeVisible();
    await expect(page.locator("text=Quality Connections").first()).toBeVisible();
  });

  test("Newsletter subscription form handles submission and duplicates", async ({ page }) => {
    await page.goto("/newsletter");
    await expect(page.locator("h1")).toContainText("Subscribe to Money Wise");

    const emailInput = page.locator("input[name='email']");
    const nameInput = page.locator("input[name='name']");
    const submitBtn = page.getByRole("button", { name: /Subscribe to Newsletter/i });

    // 1. Submit a unique test email
    const uniqueEmail = `testreader_${Date.now()}@oaucowrywise.org`;
    await nameInput.fill("Test Reader");
    await emailInput.fill(uniqueEmail);
    await submitBtn.click();

    // Verify success banner
    await expect(page.locator("text=Thank you for subscribing!").or(page.locator("text=You are already subscribed"))).toBeVisible({ timeout: 10000 });

    // 2. Re-visit and submit the same email to test duplicate handling
    await page.goto("/newsletter");
    await page.locator("input[name='email']").fill(uniqueEmail);
    await page.getByRole("button", { name: /Subscribe to Newsletter/i }).click();

    await expect(page.locator("text=You are already subscribed to the Money Wise newsletter!")).toBeVisible({ timeout: 10000 });
  });
});
