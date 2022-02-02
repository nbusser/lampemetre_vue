<template>
    <div class="header">
        <h3 :style="setMeasurementColor()">{{ uAnode }} V</h3>
        <button type="button" class="btn btn-secondary"
        @click="removeMeasurement()">
          <i class="bi-dash-lg"></i>
        </button>
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
            <tr v-for="result, i in measurementResults" :key="i">
                <th>
                  <span :style="setTubeColor(result.tube)">{{ result.tube.name }}</span>
                </th>
                <td v-for="values, j in result.results" :key="j">
                  <span v-if="typeof values === 'number'">
                    {{ values.toFixed(1) }} {{ units[j] }}
                  </span>
                  <i class="icon bi-exclamation-triangle-fill"
                  :title="values" v-else
                  >
                  </i>
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
import { Color } from '@/Color';

interface MeasurementResults {
  tube: ModelTube,
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
      return this.$store.state.tubes.map((tube: ModelTube) => {
        const uAnode = this.uAnode as number;
        const computedTube: MeasurementResults = {
          tube,
          results: [
            computeSelectedIcathode(tube, uAnode),
            computeInternalResistance(tube, uAnode),
            computeTransductance(tube, uAnode),
            computeAmplificationFactor(tube, uAnode),
          ],
        };
        return computedTube;
      });
    },
  },
  methods: {
    removeMeasurement(): void {
      this.$emit('measurementRemoved');
    },
    setMeasurementColor() {
      let stringColor = 'rgba(0, 0, 0, 1)';
      if (this.uAnode !== undefined) {
        stringColor = (this.$store.state.measurementsColors.get(this.uAnode) as Color).toString();
      }
      return {
        color: stringColor,
      };
    },
    setTubeColor(tube: ModelTube) {
      const color = this.$store.state.tubeColors.get(tube);
      if (color === undefined) {
        return '';
      }
      return {
        color: color.toString(),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
  .header {
    text-align: center;
  }

  table {
    border-collapse: collapse;
    display: inline;
  }

  th, td {
    border-style: solid;
    border-width: 0.1em;
    padding: 0.3em;
  }

  td {
    text-align: center;
  }
</style>
