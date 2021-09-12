<template>
  <q-page class="row" style="min-height: initial; position: static">
    <example-component title="할 일 목록" :todos="todos"></example-component>
  </q-page>
</template>

<script lang="ts">
import { Todo } from 'src/types/models';
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ExampleComponent },
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'Nulla voluptate fugiat Lorem sit est occaecat sit aliquip eiusmod eu eu eiusmod.',
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
        content: 'Pariatur ullamco voluptate tempor incididunt fugiat labore fugiat mollit magna.',
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
    ]);
    return { todos };
  },
});
</script>
