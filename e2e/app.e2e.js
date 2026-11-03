const { expect, test } = require("@playwright/test");

test("homepage loads and reports a healthy backend", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hello, DevOps!" }),
  ).toBeVisible();
  await expect(page.locator("#backend-status")).toHaveText(
    "Backend is healthy",
  );
  await expect(page.locator("#clock")).not.toHaveText("Loading…");

  expect(pageErrors).toEqual([]);
});

test("health endpoint responds successfully in the browser", async ({
  request,
}) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});
