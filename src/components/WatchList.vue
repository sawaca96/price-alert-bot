<template>
  <div class="list">
    <q-list>
      <div class="item-wrap" v-for="i in [1, 2, 3, 4, 5]" :key="i">
        <q-item>
          <q-item-section>
            <q-item-label class="name">Coin name</q-item-label>
            <q-item-label caption class="market">Market name</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label class="chart">line chart</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label class="price">price</q-item-label>
            <q-item-label class="change">change</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </div>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: 100%;
}
</style>
