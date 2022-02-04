<template>
  <header>
      <div class="letside">

        <h1>Lampemètre</h1>
        <SaveLoad
        @errorTriggered="$emit('errorTriggered', $event)"
        />

      </div>

      <Timer class="timer" :timer="this.$store.state.timer"/>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background: main.$blue-300;
  border-bottom: 1px solid black;
  margin-bottom: 1em;
}

h1 {
  font-size: 50px;
  margin: 0;
  padding: 0.1em 0.4em;

  flex-grow: 1;

  font-family: 'Inter', sans-serif;
}

.timer {
  margin-right: 1em;
}

.letside {
  display: flex;
  justify-content: space-between;
  gap: 2em;
  align-items: center;
}

</style>
