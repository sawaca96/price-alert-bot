<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="text-green-8"> Price Alert Bot </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="search"
          aria-label="search"
          class="text-grey"
          @click="showSearch = true"
        />
        <q-btn flat dense icon="sort" aria-label="sort" class="text-grey" />
        <q-btn
          flat
          dense
          icon="settings"
          aria-label="settings"
          class="text-grey"
          @click="showSetting = true"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <SearchDialog v-model:showSearch="showSearch" v-if="showSearch" />
    <SettingDialog v-model:showSetting="showSetting" v-if="showSetting" />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import SearchDialog from '../components/SearchDialog.vue';
import SettingDialog from '../components/SettingDialog.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { SearchDialog, SettingDialog },
  setup() {
    const showSearch = ref(false);
    const showSetting = ref(false);
    return { showSearch, showSetting };
  },
});
</script>
