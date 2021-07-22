<template>
  <q-page class="q-mt-sm">
    <WatchList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { initialize } from '../core/indexed-db';

import WatchList from 'components/WatchList.vue';

export default defineComponent({
  name: 'Index',
  components: { WatchList },
  setup() {
    onMounted(async () => {
      await initialize('price-alert-bot', ['watchlist']);
    });
  },
});
</script>
