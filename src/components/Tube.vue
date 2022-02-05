<template>
    <div class="container">
      <div class="row">
        <div class="col-8">
          <h4 class="tube_name"
          :style="setColor()">
            {{ tube.name }}
          </h4>
        </div>
        <div class="col-4">
          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="removeTube()">
            <i class="bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <h5 class="no_selec">Captures</h5>
        </div>
        <div class="col-4">
          <button type="button" class="btn btn-dark btn-sm"
          @click="this.promptCaptureModal.show()">
            <i class="bi-plus-lg"></i>
          </button>
        </div>
      </div>
      <div class="row capture" v-for="[uGrid, capture] in tube.captures" :key="uGrid">
        <div class="col">
          <input class="form-check-input" type="radio"
          :checked="tube.selectedUgrid === uGrid"
          :value="uGrid"
          @change="selectedCaptureChanged">
        </div>
        <div class="col uGrid">
          {{ capture.toString() }}
        </div>
        <div class="col">
          <button type="button" class="btn btn-outline-dark btn-sm"
            @click="removeCapture(uGrid)">
              <i class="bi-trash"></i>
          </button>
        </div>
      </div>

    <div class="defective_captures" v-for="capture, i in defectiveCaptures" :key="i">

      <div class="row pending_capture"
      v-if="capture.errorMessage === null">

        <div class="col">
          <div class="spinner-border spinner-border-sm text-primary"
          role="status"
          v-tooltip
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="En attente">
          </div>
          <span class="visually-hidden">Loading...</span>
        </div>

        <div class="col uGrid">-{{ capture.uGrid }}V</div>

        <div class="col">
          <button type="button" class="btn btn-outline-dark btn-sm"
          @click="cancelPendingCapture(capture.uGrid)">
            <i class="bi-dash-lg"></i>
          </button>
        </div>

      </div>

      <div class="row crashed_capture" v-else>

        <div class="col">
          <i class="bi-exclamation-triangle-fill text-danger"
          v-tooltip
          :title="capture.errorMessage"></i>
        </div>

        <div class="col uGrid">-{{ capture.uGrid }}V</div>

        <div class="col btn-group" role="group">
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
      <div class="col-5">
        <span v-tooltip
        class="no_selec"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Détermine la correction de bruit sur les captures.">
          Lissage
        </span>
      </div>
      <div class="col-7">
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

  <ModalPromptNumbers
  title="Nouvelle capture"
  sign='-'
  @modalCreated="this.promptCaptureModal = $event"
  @promptDone="runCaptures">
    <p>Entrez la <b>tension grille</b> pour laquelle vous souhaitez effectuer la capture.</p>
    <p>Appuyez sur ',' pour entrer une autre valeur de tension grille.</p>
    <p>La tension grille sera implicitement négative.</p>
  </ModalPromptNumbers>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube, { minSmoothingFactor, maxSmoothingFactor } from '@/model/ModelTube';
import ModalPromptNumbers from '@/components/ModalPromptNumbers.vue';
import { Color } from '@/Color';
import { Modal } from 'bootstrap';

interface DefectiveCapture {
  uGrid: number,
  errorMessage: string | null,
}

export default defineComponent({
  name: 'Tube',
  components: {
    ModalPromptNumbers,
  },
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
    promptCaptureModal: null as Modal | null,
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
    runCaptures(uGrids: number[]): void {
      uGrids.forEach((uGrid: number) => {
        this.$emit('captureRequested', uGrid);
      });
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

ul {
  list-style: none;
}

.tube_name {
  overflow: auto;
}

button {
    vertical-align: text-bottom;
}

.slider {
    input {
        vertical-align: middle;
        max-width: 100%;
    }
}

.defective_captures {
  .uGrid {
    opacity: 50%;
  }
}

.no_selec {
  user-select: none;
}

</style>
