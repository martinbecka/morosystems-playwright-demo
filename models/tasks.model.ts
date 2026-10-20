import { createMachine } from 'xstate';
import { createTestModel } from '@xstate/graph';

export const machine = createMachine({
  id: 'tasks',
  initial: 'empty',

  states: {
    empty: {
      on: {
        CREATE: 'created',
        COMPLETE: 'taskNotFound',
        INCOMPLETE: 'taskNotFound',
        DELETE: 'taskNotFound',
        UPDATE: 'taskNotFound',
      },
    },

    created: {
      on: {
        COMPLETE: 'completed',
        UPDATE: 'created',
      },
    },

    completed: {
      on: {
        INCOMPLETE: 'incompleted',
        DELETE: 'deleted',
        UPDATE: 'completed',
      },
    },

    incompleted: {
      on: {
        COMPLETE: 'completed',
        DELETE: 'deleted',
        UPDATE: 'incompleted',
      },
    },

    deleted: {
      type: 'final',
    },

    taskNotFound: {
      type: 'final',
    },
  },
});

const model = createTestModel(machine);

export const shortPaths = model.getShortestPaths();
export const simplePaths = model.getSimplePaths();
