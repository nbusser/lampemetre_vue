<template>
    <div class="header text-center mb-2">
        <div class="colorTip d-inline-block align-bottom me-2" :style="setMeasurementColor()"></div>
        <h3>{{ uAnode }} V</h3>
        <button type="button" class="btn btn-outline-dark ms-2 align-bottom"
        @click="removeMeasurement()">
          <i class="bi bi-trash"></i>
        </button>
    </div>

    <table class="table table-striped table-bordered d-inline">
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
                <td class="text-center"
                v-for="values, j in result.results" :key="j">
                  <template v-if="typeof values === 'number'">
                    {{ values.toFixed(1) }} {{ units[j] }}
                  </template>
                  <i class="icon bi bi-exclamation-triangle-fill"
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
        'background-color': stringColor,
      };
    },
    setTubeColor(tube: ModelTube) {
      const color = this.$store.state.tubeColors.get(tube);
      if (color === undefined) {
        return '';
      }
      return {
        'border-left': `0.35rem solid ${color.toString()}`,
      };
    },
  },
});
</script>

<style lang="scss" scoped>

.colorTip {
  width: 2em;
  height: 2em;
}

</style>
