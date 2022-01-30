<template>
    <div class="header">
        <h3>{{ uAnode }}</h3>
        <button @click="removeMeasurement()">-</button>
    </div>

    <table>
        <tbody>
            <tr v-if="this.tubes.length > 0">
                <th></th>
                <th>Courant cathode</th>
                <th>Résistance</th>
                <th>Transductance</th>
                <th>μ (coef)</th>
            </tr>
            <tr v-for="tube in this.tubes" :key="tube">
                <th>{{ tube.name }}</th>
                <td>?</td>
                <td>?</td>
                <td>?</td>
                <td>?</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '@/model/ModelTube';

export default defineComponent({
  name: 'Measurement',
  emits: ['measurementRemoved'],
  props: {
    uAnode: Number,
  },
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
  },
  methods: {
    removeMeasurement(): void {
      this.$emit('measurementRemoved');
    },
  },
});
</script>
