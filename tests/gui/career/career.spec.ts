/* eslint-disable playwright/expect-expect */

import { test } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';
import { CareerPage } from '../../../pages/CareerPage';

test.describe('Career - Functional tests', () => {
  test('Should filter job offers by city', async ({ page }) => {
    const homePage = new HomePage(page);
    const careerPage = new CareerPage(page);

    await test.step('Go to career page', async () => {
      await homePage.goto();
      await homePage.acceptNecessaryCookies();
      await homePage.goToCareer();
    });

    await test.step('Filter jobs for Brno', async () => {
      await careerPage.filterCity('Brno');
      await careerPage.expectElementSnapshot(careerPage.positions, 'jobs-brno.png');
    });

    await test.step('Filter jobs for home office', async () => {
      await careerPage.filterCity('home office');
      await careerPage.expectElementSnapshot(careerPage.positions, 'jobs-ho.png');
    });

    await careerPage.close();
  });
});

test.describe('Career - Visual tests', () => {
  const viewports = [
    { name: 'HD', width: 1920, height: 1080 },
    { name: 'SD', width: 999, height: 720 },
    { name: 'Mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name}`, () => {
      test.use({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });

      test('Should display career page correctly', async ({ page }) => {
        const careerPage = new CareerPage(page);

        await careerPage.goto();
        await careerPage.acceptNecessaryCookies();
        await careerPage.expectPageSnapshot(`career-page-${viewport.name}.png`);
        await careerPage.close();
      });
    });
  }
});
