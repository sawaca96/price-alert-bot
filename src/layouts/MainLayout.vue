<template>
  <q-layout class="layout" view="hHh lpr fFf">
    <q-header class="header">
      <q-toolbar>
        <q-toolbar-title class="title">
          <router-link to="/">Price Alert Bot</router-link>
        </q-toolbar-title>
        <router-link to="search"
          ><q-btn flat dense icon="search" aria-label="search" class="text-grey"
        /></router-link>
        <router-link to="setting"
          ><q-btn flat dense icon="settings" aria-label="settings" class="text-grey"
        /></router-link>
      </q-toolbar>
    </q-header>

    <q-page-container class="container scroll">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>

<style lang="scss" scoped>
.layout {
  min-width: 350px;
  a {
    color: inherit;
    text-decoration: none;
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
}

@media (max-width: $breakpoint-xs-max) {
  .layout .container {
    height: 600px;
  }
}
</style>
