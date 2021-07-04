<template>
  <q-page class="q-mt-sm">
    <List />
  </q-page>
</template>

<script lang="ts">
import List from 'components/List.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { List },
  setup() {
    return {};
  },
});
</script>
