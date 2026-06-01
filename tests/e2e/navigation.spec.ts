import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("landing page has working sign-in link", async ({ page }) => {
    await page.goto("/landing");
    const signInButton = page.getByRole("button", { name: /sign in with microsoft/i });
    await expect(signInButton).toBeVisible();
  });

  test("unknown route shows 404 or redirects", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-xyz");
    // Should either show 404 or redirect to landing
    const is404 = response?.status() === 404;
    const isRedirected = page.url().includes("/landing");
    expect(is404 || isRedirected).toBeTruthy();
  });
});

test.describe("Security headers", () => {
  test("sets X-Content-Type-Options header", async ({ page }) => {
    const response = await page.goto("/landing");
    const header = response?.headers()?.["x-content-type-options"];
    expect(header).toBe("nosniff");
  });

  test("sets X-Frame-Options header", async ({ page }) => {
    const response = await page.goto("/landing");
    const header = response?.headers()?.["x-frame-options"];
    expect(header).toBe("DENY");
  });

  test("sets Referrer-Policy header", async ({ page }) => {
    const response = await page.goto("/landing");
    const header = response?.headers()?.["referrer-policy"];
    expect(header).toBe("no-referrer");
  });
});
