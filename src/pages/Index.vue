<template>
  <q-page class="row" style="min-height: initial; position: static">
    <example-component :title="title"></example-component>
  </q-page>
</template>

<script lang="ts">
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ExampleComponent },
  setup() {
    const title = ref(localStorage.getItem('title') || '할 일 목록');
    return { title };
  },
});
</script>
