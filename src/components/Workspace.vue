<template>
  <div>
    <p>Test</p>
    <p>{{ msg }}</p>

    <Chart/>

    <div class="tubes">
      <div class="header">
        <h2>Tubes</h2>
        <button @click="addTube()">+</button>
        <button @click="clearTubes()">Vider</button>
      </div>
      <ul class="tubes">
        <li class="tube" v-for="tube in this.tubes" :key="tube">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '@/model/ModelTube';
import Chart from '@/components/Chart.vue';
import Tube from '@/components/Tube.vue';

export default defineComponent({
  name: 'Workspace',
  components: {
    Chart,
    Tube,
  },
  props: {
    msg: String,
  },
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
    runCapture(tube: ModelTube, uGrid: number) {
      this.$store.dispatch('CREATE_CAPTURE', {
        tube,
        uAnode: [1, 2, 3, 4],
        uGrid,
        iCathode: [5, 6, 7, 8],
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
  },
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
  },
});
</script>

<style lang="scss" scoped>

.header {
  > * {
    display: inline;
  }

  button {
    margin-left: 1em;
    vertical-align: text-bottom;
  }
}

.tubes {
  list-style: none;
}

</style>
