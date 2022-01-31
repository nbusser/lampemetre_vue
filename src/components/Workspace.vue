<template>
  <div>
    <Chart
    @addMeasurement="addMeasurement"
    @removeMeasurement="removeMeasurement"
    />

    <div class="tubes">
      <div class="header">
        <h2>Tubes</h2>
        <button @click="addTube()">+</button>
        <button @click="clearTubes()">Vider</button>
      </div>
      <ul>
        <li class="tube" v-for="tube, i in this.tubes" :key="i">
          <Tube :tube="tube"
          @selectedCaptureChanged="selectCaptureTube(tube, $event)"
          @captureRequested="runCapture(tube, $event)"
          @captureRemoved="removeCapture(tube, $event)"
          @tubeRemoved="removeTube(tube)"
          @smoothingFactorChanged="changeSmoothingFactor(tube, $event)"
          />
        </li>
      </ul>
    </div>

    <div class="measurements">
      <div class="header">
        <h2>Mesures</h2>
        <button @click="promptMeasurement()">+</button>
        <button @click="clearMeasurements()">Vider</button>
      </div>
      <ul>
        <li class="measurement" v-for="uAnode in this.measurements" :key="uAnode">
          <Measurement :uAnode="uAnode"
          @measurementRemoved="removeMeasurement(uAnode)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '@/model/ModelTube';
import Chart from '@/components/Chart.vue';
import Tube from '@/components/Tube.vue';
import Measurement from '@/components/Measurement.vue';
import { colorBible } from '@/Color';
import { CaptureData, performCapture } from '@/Serial';

export default defineComponent({
  name: 'Workspace',
  components: {
    Chart,
    Tube,
    Measurement,
  },
  data: () => ({
    colorBible,
  }),
  methods: {
    addTube(): void {
      const tubeName = prompt('Nom du tube');
      if (tubeName !== null) {
        const tube: ModelTube = new ModelTube(tubeName);
        this.$store.dispatch('ADD_TUBE', { tube });
      }
    },
    clearTubes(): void {
      this.$store.dispatch('EMPTY_TUBES');
    },
    selectCaptureTube(tube: ModelTube, uGrid: number) {
      this.$store.dispatch('SELECT_CAPTURE_TUBE', { tube, uGrid });
    },
    async runCapture(tube: ModelTube, uGrid: number) {
      const { tensionsAnode, currentsCathode } = await performCapture(uGrid, tube.smoothingFactor);

      this.$store.dispatch('CREATE_CAPTURE', {
        tube,
        uAnode: tensionsAnode,
        uGrid,
        iCathode: currentsCathode,
      });
    },
    removeCapture(tube: ModelTube, uGrid: number) {
      this.$store.dispatch('DELETE_CAPTURE', {
        tube,
        uGrid,
      });
    },
    removeTube(tube: ModelTube) {
      this.$store.dispatch('REMOVE_TUBE', { tube });
    },
    changeSmoothingFactor(tube: ModelTube, smoothingFactor: number) {
      this.$store.dispatch('CHANGE_SMOOTHING_FACTOR', { tube, smoothingFactor });
    },
    promptMeasurement() {
      const promptedUanode = prompt('Tension anode de mesure');
      if (promptedUanode !== null) {
        const uAnode = Number.parseFloat(promptedUanode);
        if (!Number.isNaN(uAnode)) {
          this.addMeasurement(uAnode);
        }
      }
    },
    addMeasurement(uAnode: number) {
      this.$store.dispatch('ADD_MEASUREMENT', { uAnode });
    },
    removeMeasurement(uAnode: number) {
      this.$store.dispatch('REMOVE_MEASUREMENT', { uAnode });
    },
    clearMeasurements() {
      this.$store.dispatch('CLEAR_MEASUREMENTS');
    },
  },
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
    measurements(): Set<number> {
      return this.$store.state.measurements;
    },
  },
});
</script>

<style lang="scss" scoped>

.tubes {
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }
}

.tube {
  border: 2px solid black;
  border-radius: 2%;
  padding: 1.5em;
}

.measurements {
  display: block;
}

.measurement {
  display: inline-block;
  margin: 1%;
}

ul {
  list-style: none;
}

</style>
