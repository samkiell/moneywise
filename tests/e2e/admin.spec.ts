import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || "admin@oaucowrywise.org";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || "devpassword123";

test.describe("Admin CMS Management Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate prior to admin flows
    await page.goto("/admin/login");
    await page.locator("input#email").fill(ADMIN_EMAIL);
    await page.locator("input#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Sign In to CMS/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test("Dashboard displays product metrics and navigational launchpads", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Editorial Dashboard");
    await expect(page.locator("text=Published Stories & Tabloids")).toBeVisible();
    await expect(page.locator("text=Total Subscribers")).toBeVisible();
    await expect(page.locator("text=Publications Desk")).toBeVisible();
  });

  test("Publications management and Tiptap editor creation flow", async ({ page }) => {
    // Navigate to publications list
    await page.goto("/admin/publications");
    await expect(page.locator("h1")).toContainText("Publications");

    // Click create new publication
    await page.getByRole("link", { name: /Create Publication|New Publication/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/publications\/new/);
    await expect(page.locator("h1")).toContainText("New Publication");

    // Verify form fields
    await expect(page.locator("input[placeholder*='Navigating Campus Budgeting']")).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();

    // Verify Tiptap visual editor toolbar
    const toolbar = page.locator("button[aria-label='Bold']");
    await expect(toolbar).toBeVisible();
    await expect(page.locator("button[aria-label='Italic']")).toBeVisible();
    await expect(page.locator("button[aria-label='Heading 1']")).toBeVisible();
    await expect(page.locator("button[aria-label='Bullet list']")).toBeVisible();
    await expect(page.locator(".tiptap")).toBeVisible();

    // Verify Cloudinary Image upload field
    await expect(page.locator("text=Publication Cover Image")).toBeVisible();
  });

  test("Team management interface displays editorial masthead and controls", async ({ page }) => {
    await page.goto("/admin/team");
    await expect(page.locator("h1")).toContainText("Editorial Team");
    await expect(page.getByRole("button", { name: /Add Team Member/i })).toBeVisible();

    // Verify chief editor presence from seed
    await expect(page.locator("text=Chief Editor")).toBeVisible();
  });

  test("First-party analytics page loads telemetry cards cleanly", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page.locator("h1")).toContainText("Analytics & Readership");
    await expect(page.locator("text=Total Page Views")).toBeVisible();
    await expect(page.locator("text=Unique Visitors")).toBeVisible();
    await expect(page.locator("text=Top Pages")).toBeVisible();
  });
});
