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
            <tr v-for="tube, i in this.tubes" :key="i">
                <th>{{ tube.name }}</th>
                <td>{{ getSelectedIcathode(tube) }}</td>
                <td>{{ getInternalResistance(tube) }}</td>
                <td>{{ getTransductance(tube) }}</td>
                <td>{{ getAmplificationFactor(tube) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '@/model/ModelTube';
import {
  computeAmplificationFactor,
  computeInternalResistance,
  computeSelectedIcathode,
  computeTransductance,
} from '@/MeasurementFunctions';

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
    getSelectedIcathode(tube: ModelTube) {
      return computeSelectedIcathode(tube, this.uAnode as number);
    },
    getInternalResistance(tube: ModelTube) {
      return computeInternalResistance(tube, this.uAnode as number);
    },
    getTransductance(tube: ModelTube) {
      return computeTransductance(tube, this.uAnode as number);
    },
    getAmplificationFactor(tube: ModelTube) {
      return computeAmplificationFactor(tube, this.uAnode as number);
    },
  },
});
</script>
