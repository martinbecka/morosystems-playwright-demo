import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  protected readonly url = '/';

  async goToCareer() {
    await this.page.locator('#menu-hlavni-menu').getByRole('link', { name: 'Kariéra' }).click();
  }
}
