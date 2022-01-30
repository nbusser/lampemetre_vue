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
            <tr v-for="tube, i in measurementResults" :key="i">
                <th>{{ tube.tubeName }}</th>
                <td v-for="result, j in tube.results" :key="j">
                  <span v-if="typeof result === 'number'">{{ result }} {{ units[j] }}</span>
                  <img src="@/assets/warning.svg" :title="result" v-else/>
                </td>
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

interface MeasurementResults {
  tubeName: string,
  results: (number | string)[]
}

export default defineComponent({
  name: 'Measurement',
  emits: ['measurementRemoved'],
  props: {
    uAnode: Number,
  },
  data: () => ({
    units: [
      'mA',
      'kOhm',
      'mA/V (mS)',
      '',
    ] as string[],
  }),
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
    measurementResults(): MeasurementResults[] {
      const computedTubes: MeasurementResults[] = [];
      this.$store.state.tubes.forEach((tube) => {
        const uAnode = this.uAnode as number;
        const computedTube: MeasurementResults = {
          tubeName: tube.name,
          results: [
            computeSelectedIcathode(tube, uAnode),
            computeInternalResistance(tube, uAnode),
            computeTransductance(tube, uAnode),
            computeAmplificationFactor(tube, uAnode),
          ],
        };
        computedTubes.push(computedTube);
      });
      return computedTubes;
    },
  },
  methods: {
    removeMeasurement(): void {
      this.$emit('measurementRemoved');
    },
  },
});
</script>

<style lang="scss" scoped>
  td {
    text-align: center;
    border-style: solid;
    border-width: 0.1em;
    padding: 0.3em;

    img {
      height: 1em;
      width: 1em;
    }
  }
</style>
