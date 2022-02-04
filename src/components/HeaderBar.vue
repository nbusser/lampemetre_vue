<template>
  <header>
    <h1>Lampemètre</h1>

    <div class="control">
        <SaveLoad
        @errorTriggered="$emit('errorTriggered', $event)"
        />

        <Timer class="timer" :timer="this.$store.state.timer"/>
    </div>
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background:#dcedc8;
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

.control {
  margin-right: 1em;
  display: flex;
  justify-content: space-between;
  gap: 2em;
}

</style>
