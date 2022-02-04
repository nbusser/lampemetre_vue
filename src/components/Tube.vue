<template>
    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <h2 class="tube_title"
          :style="setColor()">
            {{ tube.name }}
          </h2>
        </div>
        <div class="col-sm-4">
          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="removeTube()">
            <i class="bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-8">
          <h3 class="no_selec">Captures</h3>
        </div>
        <div class="col-sm-4">
          <button type="button" class="btn btn-dark btn-sm"
          @click="runCapture()">
            <i class="bi-plus-lg"></i>
          </button>
        </div>
      </div>
      <div class="row capture" v-for="[uGrid, capture] in tube.captures" :key="uGrid">
        <div class="col-sm">
          <input class="form-check-input" type="radio"
          :checked="tube.selectedUgrid === uGrid"
          :value="uGrid"
          @change="selectedCaptureChanged">
        </div>
        <div class="col-sm uGrid">
          {{ capture.toString() }}
        </div>
        <div class="col-sm">
          <button type="button" class="btn btn-outline-dark btn-sm"
            @click="removeCapture(uGrid)">
              <i class="bi-trash"></i>
          </button>
        </div>
      </div>

    <div class="defective_captures" v-for="capture, i in defectiveCaptures" :key="i">

      <div class="row pending_capture"
      v-if="capture.errorMessage === null">

        <div class="col-sm">
          <i class="bi bi-alarm"
          v-tooltip
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="En attente"></i>
        </div>

        <div class="col-sm uGrid">-{{ capture.uGrid }}V</div>

        <div class="col-sm">
          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="cancelPendingCapture(capture.uGrid)">
            <i class="bi-dash-lg"></i>
          </button>
        </div>

      </div>

      <div class="row crashed_capture" v-else>

        <div class="col-sm">
          <i class="bi-exclamation-triangle-fill text-danger"
          v-tooltip
          :title="capture.errorMessage"></i>
        </div>

        <div class="col-sm uGrid">-{{ capture.uGrid }}V</div>

        <div class="col-sm btn-group" role="group">
          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="retryCrashedCapture(capture.uGrid)">
          <i class="bi-arrow-clockwise"></i>
          </button>

          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="removeCrashedCapture(capture.uGrid)">
            <i class="bi-trash"></i>
          </button>
        </div>

      </div>
    </div>

    <div class="row slider">
      <div class="col-sm-4">
        <span v-tooltip
        class="no_selec"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Détermine la correction de bruit sur les captures.">
          Lissage
        </span>
      </div>
      <div class="col-sm-8">
        <input type="range"
        :min="minSmoothingFactor"
        :max="maxSmoothingFactor"
        :value="tube.smoothingFactor"
        :disabled="!tube.canChangeSmoothingFactor() || pendingCaptures.length > 0"
        @change="smoothingFactorChanged"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube, { minSmoothingFactor, maxSmoothingFactor } from '@/model/ModelTube';
import { Color } from '@/Color';

interface DefectiveCapture {
  uGrid: number,
  errorMessage: string | null,
}

export default defineComponent({
  name: 'Tube',
  emits: [
    'selectedCaptureChanged',
    'captureRequested',
    'captureRemoved',
    'tubeRemoved',
    'smoothingFactorChanged',
    'pendingCaptureCanceled',
    'crashedCaptureRemoved',
  ],
  props: {
    tube: ModelTube,
  },
  data: () => ({
    minSmoothingFactor,
    maxSmoothingFactor,
  }),
  computed: {
    // Gathers both pending and crashed captures in a sorted fashion
    defectiveCaptures() {
      // First, get all the pending captures and add them a null errorMessage field
      let allDefective = this.pendingCaptures.map((uGrid) => ({
        uGrid,
        errorMessage: null,
      } as DefectiveCapture));

      // Then, concats all the crashedCaptures
      allDefective = allDefective.concat(this.crashedCaptures);

      // Finally, sorts along uGrid
      allDefective.sort((a, b) => a.uGrid - b.uGrid);
      return allDefective;
    },
    pendingCaptures() {
      if (this.tube === undefined) {
        return [];
      }
      const queue = this.$store.state.captureModule.waitingQueue;
      return queue.filter(
        (job) => job.tube === this.tube,
      ).map((job) => job.uGrid);
    },
    crashedCaptures() {
      if (this.tube === undefined) {
        return [];
      }
      const { graveyard } = this.$store.state.captureModule;
      return graveyard.filter(
        (log) => log.job.tube === this.tube,
      ).map((log) => ({
        uGrid: log.job.uGrid,
        errorMessage: log.error,
      } as DefectiveCapture));
    },
  },
  methods: {
    runCapture(): void {
      if (this.$props.tube !== undefined) {
        const uGridText = prompt('Tension grille');
        if (uGridText === null) { return; }

        const promptedUgrids = uGridText.split(' ');

        for (let i = 0; i < promptedUgrids.length; i += 1) {
          const promptedUgrid = promptedUgrids[i];

          const uGrid = Number.parseFloat(promptedUgrid);
          if (Number.isNaN(uGrid)) { return; }

          this.$emit('captureRequested', uGrid);
        }
      }
    },
    removeCapture(uGrid: number): void {
      this.$emit('captureRemoved', uGrid);
    },
    removeTube(): void {
      this.$emit('tubeRemoved');
    },
    selectedCaptureChanged(evt: Event): void {
      const newValue = Number.parseFloat((evt.target as any).value);
      this.$emit('selectedCaptureChanged', newValue);
    },
    smoothingFactorChanged(evt: Event): void {
      const newValue = Number.parseInt((evt.target as any).value, 10);
      this.$emit('smoothingFactorChanged', newValue);
    },
    setColor() {
      let stringColor = 'rgba(0, 0, 0, 1)';
      if (this.tube !== undefined) {
        stringColor = (this.$store.state.tubeColors.get(this.tube) as Color).toString();
      }
      return {
        color: stringColor,
      };
    },
    cancelPendingCapture(uGrid: number): void {
      this.$emit('pendingCaptureCanceled', uGrid);
    },
    removeCrashedCapture(uGrid: number): void {
      this.$emit('crashedCaptureRemoved', uGrid);
    },
    retryCrashedCapture(uGrid: number): void {
      this.$emit('captureRequested', uGrid);
    },
  },
});
</script>

<style lang="scss" scoped>

.tube {
    display: inline-block;
}

.capture {
  div {
    display: inline;
  }
}

ul {
  list-style: none;
}

button {
    vertical-align: text-bottom;
}

.control {
  display: inline;
  margin-left: 0.2em;

  button {
    margin-left: 0.4em;
  }
}

.slider {
    input {
        vertical-align: middle;
    }
}

.pending_capture, .crashed_capture {
  img {
    vertical-align: text-top;
    height: 1em;
    width: 1em;
  }
  span {
    margin-left: 0.3em;
  }
}

.pending_capture {
  span {
    color: rgba(0, 0, 0, 0.4);
  }
}

.no_selec {
  user-select: none;
}

</style>
