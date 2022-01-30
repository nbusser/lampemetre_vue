<template>
    <div class="header">
        <h3>{{ uAnode }}</h3>
        <button @click="removeMeasurement()">-</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Measurement',
  props: {
    uAnode: Number,
  },
  methods: {
    removeMeasurement() {
      this.$emit('measurementRemoved');
    },
  },
});
</script>
