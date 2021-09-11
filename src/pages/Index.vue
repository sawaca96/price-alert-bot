<template>
  <q-page class="row" style="min-height: initial; position: static">
    <example-component title="할 일 목록" active :todos="todos" :meta="meta"></example-component>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'src/types/models';
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
      },
      {
        id: 2,
        content:
          'Ex ea nostrud ad velit est consectetur voluptate laboris exercitation Lorem eiusmod.',
      },
      {
        id: 3,
        content: 'Eu ut ut enim do.',
      },
      {
        id: 4,
        content: 'Pariatur ullamco voluptate tempor incididunt fugiat labore fugiat mollit magna.',
      },
      {
        id: 5,
        content: 'Magna consequat quis labore quis nulla fugiat fugiat ipsum ad.',
      },
      {
        id: 6,
        content: 'Anim enim ex ex adipisicing sunt magna enim ea minim enim ex excepteur.',
      },
      {
        id: 7,
        content: 'Enim aliquip aliqua sint consectetur deserunt in cupidatat irure nostrud.',
      },
      {
        id: 8,
        content: 'Laborum non excepteur labore incididunt elit.',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { todos, meta };
  },
});
</script>
