/* eslint-disable playwright/no-conditional-expect */

import { test, expect } from '../../../fixtures/tasks.fixture';
import { ResponseError } from '../../../openapi';

test.describe('DELETE /tasks/{id}', () => {
  test('200 - Delete task', async ({ api }) => {
    const createResponse = await api.tasksPostRaw({
      createTask: { text: 'string' },
    });

    const createdTask = await createResponse.value();

    const deleteResponse = await api.tasksIdDeleteRaw({ id: createdTask.id });

    expect(deleteResponse.raw.status).toBe(200);

    const deleteTask = await deleteResponse.value();

    expect(deleteTask).toBe('');
  });

  test('404 - Wrong Id', async ({ api }) => {
    try {
      await api.tasksIdDeleteRaw({
        id: 'non-existing-task',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);

      const responseError = error as ResponseError;

      expect(responseError.response.status).toBe(404);
    }
  });
});
