<template>
  <div class="composition-component q-pa-md text-white">
    <div class="popup-header">
      <input type="text" :value="title" @input="updateTitle($event.target.value)" />
      <span class="todo-num-title">({{ todoCount }}/{{ totalCount }})</span>
    </div>
    <ul class="list-container">
      <li v-for="todo in todos" :key="todo.id" class="list-item">
        <label class="field"
          ><input
            type="checkbox"
            :checked="todo.checked"
            @change="checkTodo($event.target.checked, todo.id)"
            data-action="done"
        /></label>
        <div class="field" data-action="update">
          <input
            type="text"
            :value="todo.content"
            @input="updateContent($event.target.value, todo.id)"
            :title="todo.content"
            :class="{ checked: todo.checked }"
          />
        </div>
        <div class="field" data-action="remove row justify-center">
          <q-btn
            flat
            dense
            icon="delete"
            aria-label="delete"
            @click="deleteTodo(todo.id)"
            class="text-grey text-right icon-remove"
          />
        </div>
      </li>
    </ul>
    <div class="input-container">
      <input
        type="text"
        v-model="newTodo"
        @keyup.enter="createTodo($event.target.value)"
        placeholder="할 일을 입력하세요"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRef, Ref, ref } from 'vue';
import { useStore } from '../store';

import { Todo } from '../types/models';
import { idb, idbUpdate } from '../core/idb';

const useTodoApi = () => {
  const store = useStore();
  const newTodo = ref('');
  const checkTodo = async (checked: boolean, todoID: number) => {
    store.commit('CHECK_TODO', { todoID, checked });
    const index = store.state.todos.findIndex((todo) => todo.id === todoID);
    const todo = store.state.todos[index];
    await idbUpdate('todolist', 'checked', todo);
  };
  const updateContent = async (content: string, todoID: number) => {
    store.commit('UPDATE_TODO_CONTENT', { todoID, content });
    const index = store.state.todos.findIndex((todo) => todo.id === todoID);
    const todo = store.state.todos[index];
    await idbUpdate('todolist', 'content', todo);
  };
  const deleteTodo = async (todoID: number) => {
    store.commit('DELETE_TODO', todoID);
    await idb.delete('todolist', IDBKeyRange.only(todoID));
  };
  const createTodo = async (content: string) => {
    const todoID = await idb.add('todolist', {
      checked: false,
      content,
    });
    const todo = {
      checked: false,
      content,
      id: todoID,
    };
    store.commit('CREATE_TODO', todo);
    newTodo.value = '';
  };

  return { checkTodo, updateContent, deleteTodo, createTodo, newTodo };
};

function useDisplayTodo(todos: Ref<Todo[]>) {
  const totalCount = computed(() => todos.value.length);
  const todoCount = computed(() => todos.value.filter((todo) => !todo.checked).length);
  return { totalCount, todoCount };
}

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(_, context) {
    const store = useStore();
    const todos = computed(() => store.state.todos);
    const updateTitle = (title: string) => {
      context.emit('update-title', title);
      localStorage.setItem('title', title);
    };

    return {
      todos,
      updateTitle,
      ...useTodoApi(),
      ...useDisplayTodo(toRef(store.state, 'todos')),
    };
  },
});
</script>

<style lang="scss" scoped>
.composition-component {
  width: 482px;
  height: 376px;
}

.composition-component .input-container {
  height: 46px;
  background-color: #181818;
  input {
    height: 100%;
    width: 100%;
    border: none;
    background: transparent;
    padding-inline-start: 15px;
    outline: none;
    color: #a8a8a8;
  }
}

.composition-component .popup-header {
  display: flex;
  margin-left: 14px;
  input[type='text'] {
    width: 70px;
    height: 28px;
    font-weight: bold;
    color: #eeeeee;
    border: none;
    background: transparent;
    outline: none;
    &:hover {
      background-color: #2f2f2f;
    }
  }
  .todo-num-title {
    font-size: 13px;
    line-height: 28px;
    font-weight: normal;
    padding: 1px;
    opacity: 0.5;
  }
}

.composition-component .list-container {
  height: 260px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 3px;
    background-color: #121212;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #7f7f7f;
  }
  margin: 0;
  padding: 0;
  margin-block-start: 15px;
  padding-block-end: 10px;
  .list-item {
    position: relative;
    display: flex;
    list-style: none;
  }
  .list-item:hover {
    background-color: #2f2f2f;
  }
}

.composition-component .list-container .list-item .field {
  vertical-align: middle;
  line-height: 30px;
}

.composition-component .list-container .list-item label.field {
  margin-left: 14px;
  input[type='checkbox'] {
    vertical-align: middle;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    &:not(:checked) {
      background: #424242;
      border: 1px solid #525225;
    }
    &:checked {
      border-color: #00dc9b;
      background-color: #00cc86;
    }
  }
}

.composition-component .list-container .list-item [data-action='update'] {
  width: calc(100% - 14px);
  margin-left: 14px;
  input[type='text'] {
    width: 100%;
    height: 28px;
    font-size: 13px;
    color: #eeeeee;
    border: none;
    background: transparent;
    outline: none;
    &.checked {
      color: #878481;
      text-decoration: line-through;
      opacity: 0.5;
    }
  }
}

.composition-component .list-container .list-item [data-action='remove'] {
  width: 30px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  .icon-remove {
    width: 10px;
    height: 10px;
  }
}
</style>
