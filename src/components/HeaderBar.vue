<template>
  <header class="d-flex mb-4 justify-content-between align-items-center">
      <div class="d-flex gap-8 justify-content-between align-items-center">

        <h1 class="text-light m-0 py-1 px-3">Lampemètre</h1>
        <SaveLoad
        @errorTriggered="$emit('errorTriggered', $event)"
        />

      </div>

      <Timer class="timer me-4" :timer="this.$store.state.timer"/>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Timer from '@/components/Timer.vue';
import SaveLoad from '@/components/SaveLoad.vue';

export default defineComponent({
  name: 'HeaderBar',
  components: {
    Timer,
    SaveLoad,
  },
  emits: [
    'errorTriggered',
  ],
});
</script>

<style lang="scss" scoped>

@use '../scss/main.scss';

header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: main.$blue-300;
}

h1 {
  font-size: 50px;

  font-family: 'Inter', sans-serif;
  font-weight: bold;
}

</style>
