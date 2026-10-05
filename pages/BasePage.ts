import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected abstract readonly url: string;

  async goto() {
    await this.page.goto(this.url);
  }

  async close() {
    await this.page.close();
  }

  async acceptNecessaryCookies() {
    const button = this.page.getByRole('button', {
      name: 'Pouze nutné',
    });

    try {
      await this.page.keyboard.press('ArrowUp'); // This shows banner quicker
      await button.waitFor({
        state: 'visible',
        timeout: 3000,
      });

      await button.click();
    } catch {
      // Cookie banner not showing for gecko and webkit
    }
  }

  async expectPageSnapshot(snapshotName: string, maxDiffPixelRatio = 0.05) {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.mouse.move(0, 0);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(150);

    await expect(this.page).toHaveScreenshot(snapshotName, {
      fullPage: true,
      maxDiffPixelRatio: maxDiffPixelRatio,
    });
  }

  async expectElementSnapshot(locator: Locator, snapshotName: string, maxDiffPixelRatio = 0.05) {
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();

    await this.page.mouse.move(0, 0);

    const box = await locator.boundingBox();

    if (!box) {
      throw new Error(`Could not find bounding box for element: ${locator.toString()}`);
    }

    await expect(this.page).toHaveScreenshot(snapshotName, {
      clip: {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
      },
      maxDiffPixelRatio: maxDiffPixelRatio,
    });
  }
}
