import { test, expect } from '../../../fixtures/tasks.fixture';

test.describe('GET /tasks/completed', () => {
  test('200 - Returns empty array when no tasks are completed', async ({ api }) => {
    const response = await api.tasksCompletedGetRaw();

    expect(response.raw.status).toBe(200);

    const tasks = await response.value();

    expect(tasks).toEqual([]);
  });

  test('200 - Returns completed tasks', async ({ api }) => {
    const createResponse = await api.tasksPostRaw({
      createTask: { text: 'Task 1' },
    });

    const task = await createResponse.value();

    await api.tasksIdCompletePostRaw({
      id: task.id,
    });

    const response = await api.tasksCompletedGetRaw();

    expect(response.raw.status).toBe(200);

    const tasks = await response.value();

    expect(tasks).toHaveLength(1);

    expect(tasks[0]).toEqual({
      id: task.id,
      text: 'Task 1',
      completed: true,
      createdDate: expect.any(Number),
      completedDate: expect.any(Number),
    });
  });
});
