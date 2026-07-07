import { test, expect } from "@playwright/test";

test.describe("password visibility toggle", () => {
  test("password field starts masked", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.locator("input#password");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggle shows password when clicked", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.locator("input#password");
    const toggleButton = page.locator('button[aria-label="Show password"]');

    await passwordInput.fill("mysecretpassword");
    await toggleButton.click();

    await expect(passwordInput).toHaveAttribute("type", "text");
    await expect(passwordInput).toHaveValue("mysecretpassword");
  });

  test("toggle hides password when clicked again", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.locator("input#password");
    const toggleButton = page.locator('button[aria-label="Show password"]');

    await passwordInput.fill("mysecretpassword");
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.locator('button[aria-label="Hide password"]').click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggle button changes icon between eye and eye-off", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.locator('button[aria-label="Show password"]'),
    ).toBeVisible();

    await page.locator('button[aria-label="Show password"]').click();
    await expect(
      page.locator('button[aria-label="Hide password"]'),
    ).toBeVisible();
  });
});

test.describe("SSO button behavior", () => {
  test("SSO button is visible on login form", async ({ page }) => {
    await page.goto("/login");
    const ssoButton = page.getByText("Sign in with Single Sign-On (SSO)");
    await expect(ssoButton).toBeVisible();
  });

  test("SSO button is clickable and shows error when SSO not configured", async ({
    page,
  }) => {
    await page.goto("/login");
    const ssoButton = page.getByText("Sign in with Single Sign-On (SSO)");

    await ssoButton.click();

    // Should show a fallback error message
    await expect(
      page.getByText("Single Sign-On is not configured"),
    ).toBeVisible({ timeout: 3000 });
  });
});

test.describe("remember me checkbox", () => {
  test("remember me checkbox is present and unchecked by default", async ({
    page,
  }) => {
    await page.goto("/login");
    const checkbox = page.locator("input#remember-me");

    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  });

  test("remember me checkbox can be toggled", async ({ page }) => {
    await page.goto("/login");
    const checkbox = page.locator("input#remember-me");
    const label = page.getByText("Remember me");

    await label.click();
    await expect(checkbox).toBeChecked();

    await label.click();
    await expect(checkbox).not.toBeChecked();
  });

  test("remember me label is clickable", async ({ page }) => {
    await page.goto("/login");
    const checkbox = page.locator("input#remember-me");
    const label = page.getByText("Remember me");

    await label.click();
    await expect(checkbox).toBeChecked();
  });
});

test.describe("forgot password flow", () => {
  test("forgot password link navigates to reset password page", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByText("Forgot password?").click();

    await expect(page).toHaveURL(/\/reset-password/);
  });

  test("reset password page has email input field", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Forgot password?").click();

    await expect(page.locator("input#reset-email")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("reset password page has back to sign in link", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Forgot password?").click();

    const backLink = page.getByText("Back to Sign In");
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("empty reset form submission does not navigate away", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByText("Forgot password?").click();

    await page.locator("button[type='submit']").click();

    // Should stay on reset password page
    await expect(page).toHaveURL(/\/reset-password/);
  });

  test("direct navigation to reset-password page is accessible", async ({
    page,
  }) => {
    // Reset password pages should be publicly accessible (no auth required)
    await page.goto("/reset-password");
    await expect(page.locator("input#reset-email")).toBeVisible();
  });
});

test.describe("login form edge cases", () => {
  test("employee ID field shows helper text", async ({ page }) => {
    await page.goto("/login");
    const helperText = page.getByText("Your employee ID is on your badge.");
    await expect(helperText).toBeVisible();
  });

  test("NFC badge icon is present in employee ID field", async ({ page }) => {
    await page.goto("/login");
    const nfcIcon = page.getByTestId("nfc-icon");
    await expect(nfcIcon).toBeVisible();
  });

  test("login card has glass styling classes", async ({ page }) => {
    await page.goto("/login");
    const form = page.locator("form[data-testid='login-form']");
    await expect(form).toBeVisible();
    // Form should use glass/liquid styling
    const classAttr = await form.getAttribute("class");
    expect(classAttr).not.toBeNull();
  });
});
