import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex';

import { Todo } from '../types/models';
import { IcheckTodo, IupdateTodoContent } from './types/models';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  // example: unknown;
  todos: Todo[];
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      // example
    },
    state: () => ({
      todos: [
        {
          id: 1,
          content:
            'Nulla voluptate fugiat Lorem sit est occaecat sit aliquip eiusmod eu eu eiusmod.',
          checked: true,
        },
        {
          id: 2,
          content:
            'Ex ea nostrud ad velit est consectetur voluptate laboris exercitation Lorem eiusmod.',
          checked: true,
        },
        {
          id: 3,
          content: 'Eu ut ut enim do.',
          checked: false,
        },
        {
          id: 4,
          content:
            'Pariatur ullamco voluptate tempor incididunt fugiat labore fugiat mollit magna.',
          checked: false,
        },
        {
          id: 5,
          content: 'Magna consequat quis labore quis nulla fugiat fugiat ipsum ad.',
          checked: false,
        },
        {
          id: 6,
          content: 'Anim enim ex ex adipisicing sunt magna enim ea minim enim ex excepteur.',
          checked: false,
        },
        {
          id: 7,
          content: 'Enim aliquip aliqua sint consectetur deserunt in cupidatat irure nostrud.',
          checked: false,
        },
        {
          id: 8,
          content: 'Laborum non excepteur labore incididunt elit.',
          checked: false,
        },
      ],
    }),
    mutations: {
      CHECK_TODO(state: StateInterface, { todoID, checked }: IcheckTodo) {
        const index = state.todos.findIndex((todo) => todo.id === todoID);
        state.todos[index].checked = checked;
      },
      UPDATE_TODO_CONTENT(state: StateInterface, { todoID, content }: IupdateTodoContent) {
        const index = state.todos.findIndex((todo) => todo.id === todoID);
        state.todos[index].content = content;
      },
      DELETE_TODO(state: StateInterface, todoID: number) {
        const index = state.todos.findIndex((todo) => todo.id === todoID);
        state.todos.splice(index, 1);
      },
      CREATE_TODO(state: StateInterface, content: string) {
        const todo: Todo = {
          id: state.todos.length,
          checked: false,
          content,
        };
        state.todos.push(todo);
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
