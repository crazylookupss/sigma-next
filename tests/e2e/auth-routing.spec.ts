import { expect, test } from "@playwright/test";

test("landing page renders the sign-in experience", async ({ page }) => {
  await page.goto("/landing");

  await expect(page).toHaveTitle(/SIGMA/i);
  await expect(
    page.getByRole("button", { name: /sign in with microsoft/i })
  ).toBeVisible();
});

test("protected dashboard redirects anonymous users to landing", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/landing$/);
});
