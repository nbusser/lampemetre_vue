<template>
  <div class="container">
    <div class="card">
      <div class="card-header p-0 d-flex justify-content-between"
      :style="{'border-top': `0.35rem solid ${setColor()}`}">
        <h5 class="p-2">{{ tube.name }}</h5>
        <button type="button" class="btn btn-outline-danger border-0"
        @click="removeTube()">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="card-body p-2">
        <p class="card-text mb-2">
          <button type="button"
          class="btn btn-outline-primary w-100 d-flex gap-2 align-items-center"
          @click="this.promptCaptureModal.show()">
            <span class="flex-fill">Nouvelle capture</span>
            <i class="bi bi-plus-circle"></i>
          </button>
        </p>
        <ul class="list-group"
        :class="tube.captures.size > 0 ? 'mb-2' : ''">
          <li class="capture list-group-item d-flex p-0"
          v-for="[uGrid, capture] in tube.captures" :key="uGrid">
            <div class="flex-fill p-2">
              <label class="form-check-label flex-fill d-flex gap-2 align-items-center">
                <input type="radio"
                :checked="tube.selectedUgrid === uGrid"
                :value="uGrid"
                @change="selectedCaptureChanged"/>
                <div>{{ capture.toString() }}</div>
              </label>
            </div>
            <button type="button" class="btn btn-outline-danger border-0"
            @click="removeCapture(uGrid)">
              <i class="bi bi-trash"></i>
            </button>
          </li>
        </ul>
        <ul class="defective_captures list-group">
          <li class="list-group-item d-flex p-0"
          v-for="capture, i in defectiveCaptures" :key="i">

            <template
            v-if="capture.errorMessage === null">
              <div class="flex-fill p-2">
                <div class="flex-fill d-flex gap-2">
                  <div class="spinner-border spinner-border-sm text-primary"
                  role="status"
                  v-tooltip
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="En attente">
                  </div>
                  <label class="uGrid">-{{ capture.uGrid }}V</label>
                </div>
              </div>
              <button type="button" class="btn btn-outline-dark border-0"
              @click="cancelPendingCapture(capture.uGrid)">
                <i class="bi bi-trash"></i>
              </button>
            </template>

            <template v-else>
              <div class="flex-fill p-2">
                <div class="flex-fill d-flex gap-2">
                  <i class="bi-exclamation-triangle-fill text-danger"
                  v-tooltip
                  :title="capture.errorMessage"></i>
                  <label class="uGrid">-{{ capture.uGrid }}V</label>
                </div>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-dark border-0"
                @click="retryCrashedCapture(capture.uGrid)">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button type="button" class="btn btn-outline-dark border-0"
                @click="removeCrashedCapture(capture.uGrid)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <div class="card-footer">
        <label class="d-flex gap-2">
          <span v-tooltip
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Détermine la correction de bruit sur les captures.">
            Lissage
          </span>
          <input type="range" class="form-range"
          :min="minSmoothingFactor"
          :max="maxSmoothingFactor"
          :value="tube.smoothingFactor"
          :disabled="!tube.canChangeSmoothingFactor() || pendingCaptures.length > 0"
          @change="smoothingFactorChanged"/>
        </label>
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
      return stringColor;
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

button {
    vertical-align: text-bottom;
}

.defective_captures {
  .uGrid {
    opacity: 50%;
  }
}

</style>
