/* eslint-disable playwright/no-conditional-expect */

import { test, expect } from '../../../fixtures/tasks.fixture';
import { ResponseError } from '../../../openapi';

test.describe('POST /tasks/{id}/complete', () => {
  test('200 - Complete task', async ({ api }) => {
    const createResponse = await api.tasksPostRaw({
      createTask: { text: 'string' },
    });

    const task = await createResponse.value();

    const completeResponse = await api.tasksIdCompletePostRaw({
      id: task.id,
    });

    expect(completeResponse.raw.status).toBe(200);

    const completeTask = await completeResponse.value();

    expect(completeTask).toEqual({
      id: task.id,
      text: 'string',
      completed: true,
      completedDate: expect.any(Number),
      createdDate: expect.any(Number),
    });
  });

  test('404 - Wrong Id', async ({ api }) => {
    try {
      await api.tasksIdCompletePostRaw({
        id: 'nonexistent-id-000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);

      const responseError = error as ResponseError;

      expect(responseError.response.status).toBe(404);
    }
  });
});
