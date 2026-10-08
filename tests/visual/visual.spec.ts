import { expect, test } from "@playwright/test";
import { routes } from "./routes";

const FROZEN_TIME = new Date("2026-10-07T12:00:00Z");
const SCROLL_STEP = 600;

for (const route of routes) {
  test(route.name, async ({ page }, info) => {
    test.skip(Boolean(route.desktopOnly) && info.project.name !== "desktop");

    await page.clock.setFixedTime(FROZEN_TIME);
    const response = await page.goto(route.path, { waitUntil: "networkidle" });
    expect(response?.status(), route.path).toBe(route.status ?? 200);

    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async (step) => {
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    }, SCROLL_STEP);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot(`${route.name}-${info.project.name}.png`, { fullPage: true });
  });
}
