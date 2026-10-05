import { BasePage } from './BasePage';

export class CareerPage extends BasePage {
  protected readonly url = '/kariera';

  private get cityFilter() {
    return this.page.locator('.inp-custom-select').first();
  }

  async filterCity(city: string) {
    await this.cityFilter.click();

    await this.cityFilter.locator('label').filter({ hasText: city }).click();
  }

  get positions() {
    return this.page.locator('div#pozice');
  }
}
