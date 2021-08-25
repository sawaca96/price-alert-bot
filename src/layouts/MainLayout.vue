<template>
  <q-layout class="layout" view="hHh lpr fFf">
    <q-header bordered class="header">
      <q-toolbar>
        <q-toolbar-title class="title"> Price Alert Bot </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="search"
          aria-label="search"
          class="text-grey"
          @click="showSearch = true"
        />
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

    <q-page-container class="container">
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

<style lang="scss" scoped>
.layout {
  width: 300px;
  height: 600px;
}
.header {
  background-color: #2d333b;
}
.title {
  color: rgb(205 217 229 / 70%);
}
.container {
  background-color: #1c2128;
}
</style>
