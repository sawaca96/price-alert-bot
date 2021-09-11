<template>
  <div class="composition-component q-pa-md text-white">
    <div class="popup-header">
      {{ title }}
      <span class="todo-num-title">{{ clickCount }}</span>
    </div>
    <ul class="list-container">
      <li v-for="todo in todos" :key="todo.id" @click="increment" class="list-item">
        <label class="field"><input type="checkbox" data-action="done" /></label>
        <div class="field" data-action="update">
          <input type="text" class="input" :value="todo.content" :title="todo.content" />
        </div>
        <div class="field" data-action="remove row justify-center">
          <q-btn
            flat
            dense
            icon="delete"
            aria-label="delete"
            class="text-grey text-right icon-remove"
          />
        </div>
      </li>
    </ul>
    <div class="input-container">
      <input type="text" placeholder="할 일을 입력하세요" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, toRef, Ref } from 'vue';
import { Todo, Meta } from '../types/models';

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [],
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')) };
  },
});
</script>

<style lang="scss" scoped>
.composition-component {
  width: 482px;
  height: 372px;
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
  font-size: 14px;
  font-weight: bold;
  margin-left: 14px;
  .todo-num-title {
    font-size: 13px;
    font-weight: normal;
    padding-left: 5px;
    opacity: 0.5;
    float: right;
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
  }
  input[type='text']:focus {
    color: #878481;
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
