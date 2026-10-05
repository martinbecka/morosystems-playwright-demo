import { test as base } from '@playwright/test';
import { Configuration } from '../openapi/runtime';
import { TasksApi } from '../openapi/apis/TasksApi';

type Fixtures = {
  api: TasksApi;
  cleanTasks: void;
};

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const config = new Configuration({ basePath: 'http://localhost:8080' });

    await use(new TasksApi(config));
  },

  cleanTasks: [
    async ({ api }, use) => {
      const response = await api.tasksGetRaw();
      const tasks = await response.value();

      for (const task of tasks) {
        await api.tasksIdDeleteRaw({
          id: task.id,
        });
      }

      await use();
    },
    {
      auto: true,
    },
  ],
});

export { expect } from '@playwright/test';
