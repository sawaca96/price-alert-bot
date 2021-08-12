<template>
  <q-dialog :modelValue="showOrder" @update:modelValue="toggleSetting">
    <q-card>
      <q-card-section>
        <div class="text-h6">Setting</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh; width: 30vh" class="scroll">
        <q-list>
          <div class="item-wrap" v-for="watchSymbol in watchSymbols" :key="watchSymbol.symbol">
            <q-item>
              <q-item-section>
                <q-item-label class="name">{{ watchSymbol.symbol }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-btn flat dense icon="reorder" aria-label="reorder" class="text-grey" />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />
          </div>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../store';

export default defineComponent({
  props: {
    showOrder: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });

    const toggleSetting = (e: Event) => {
      emit('update:showOrder', e);
    };
    return { toggleSetting, watchSymbols };
  },
});
</script>
