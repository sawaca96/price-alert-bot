<template>
  <q-page class="q-mt-sm">
    <WatchList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WatchList from 'components/WatchList.vue';

export default defineComponent({
  name: 'Index',
  components: { WatchList },
});
</script>
