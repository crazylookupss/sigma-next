import { expect, test } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders title and sign-in button", async ({ page }) => {
    await page.goto("/landing");
    await expect(page).toHaveTitle(/SIGMA/i);
    await expect(
      page.getByRole("button", { name: /sign in with microsoft/i })
    ).toBeVisible();
  });

  test("shows feature descriptions", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.getByText(/entra id/i).first()).toBeVisible();
  });
});

test.describe("Auth routing", () => {
  test("protected dashboard redirects to landing", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/landing$/);
  });

  test("applications page redirects to landing when unauthenticated", async ({ page }) => {
    await page.goto("/applications");
    await expect(page).toHaveURL(/\/landing$/);
  });

  test("users page redirects to landing when unauthenticated", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL(/\/landing$/);
  });

  test("groups page redirects to landing when unauthenticated", async ({ page }) => {
    await page.goto("/groups");
    await expect(page).toHaveURL(/\/landing$/);
  });
});
