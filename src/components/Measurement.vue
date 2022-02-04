<template>
    <div class="header">
        <h3 :style="setMeasurementColor()">{{ uAnode }} V</h3>
        <button type="button" class="btn btn-outline-danger"
        @click="removeMeasurement()">
          <i class="bi bi-dash-lg"></i>
        </button>
    </div>

    <table class="table table-striped table-bordered">
        <thead>
          <tr v-if="this.tubes.length > 0">
            <th scope="col"></th>
            <th scope="col">Courant cathode</th>
            <th scope="col">Résistance</th>
            <th scope="col">Transductance</th>
            <th scope="col">μ (coef)</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="result, i in measurementResults" :key="i">
                <th scope="col" :style="setTubeColor(result.tube)">
                  {{ result.tube.name }}
                </th>
                <td v-for="values, j in result.results" :key="j">
                  <template v-if="typeof values === 'number'">
                    {{ values.toFixed(1) }} {{ units[j] }}
                  </template>
                  <i class="icon bi-exclamation-triangle-fill"
                  v-tooltip
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

    button {
      margin-left: 0.8em;
      vertical-align: bottom;
    }
  }

  table {
    display: inline;
  }

  td {
    text-align: center;
  }
</style>
