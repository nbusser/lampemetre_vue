<template>
    <div class="header">
        <h2 class="tube_title" :style="setColor()">{{ tube.name }}</h2>
        <button class="btn_remove_tube" @click="removeTube()">-</button>
    </div>
    <div class="all_captures">
        <div class="header">
            <h3 class="title">Captures</h3>
            <button class="add_capture" @click="runCapture()">+</button>
        </div>
        <ul class="captures">
            <li class="capture" v-for="[uGrid, capture] in tube.captures" :key="uGrid">
              <div>
                <label>
                    <input type="radio"
                    :checked="tube.selectedUgrid === uGrid"
                    :value="uGrid"
                    @change="selectedCaptureChanged">
                    <div>
                        <span>{{ capture.toString() }}</span>
                        <div class="control">
                          <button @click="removeCapture(uGrid)">
                            -
                          </button>
                        </div>
                    </div>
                </label>
              </div>
            </li>
        </ul>
        <ul class="pending_captures">
          <li v-for="uGrid in pendingCaptures" :key="uGrid">
            <img src="@/assets/ghost.png">
            <span>-{{ uGrid }}V</span>
            <div class="control">
              <button @click="cancelPendingCapture(uGrid)">
                -
              </button>
            </div>
          </li>
        </ul>
        <ul class="crashed_captures">
          <li v-for="crashLog, i in crashedCaptures" :key="i">
            <img src="@/assets/warning.svg" :title="crashLog.error">
              <span>-{{ crashLog.uGrid }}V</span>
              <div class="control">
                <button @click="retryCrashedCapture(crashLog.uGrid)">
                  ↺
                </button>
                <button @click="removeCrashedCapture(crashLog.uGrid)">
                  -
                </button>
              </div>
          </li>
        </ul>
    </div>
    <div class="slider">
        <span>Lissage:</span>
        <input type="range"
        :min="minSmoothingFactor"
        :max="maxSmoothingFactor"
        :value="tube.smoothingFactor"
        :disabled="!tube.canChangeSmoothingFactor() || pendingCaptures.length > 0"
        @change="smoothingFactorChanged"
        >
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube, { minSmoothingFactor, maxSmoothingFactor } from '@/model/ModelTube';
import { Color } from '@/Color';

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
        error: log.error,
      }));
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
}

.slider {
    margin-top: 0.5em;
    width: min-content;

    input {
        display: inline-block;
        max-width: 50%;
        vertical-align: bottom;
    }
}

.pending_captures, .crashed_captures {
  img {
    vertical-align: text-top;
    height: 1em;
    width: 1em;
  }
  span {
    margin-left: 0.3em;
  }
  button {
    margin-left: 0.4em;
  }
}

.pending_captures {
  span {
    color: rgba(0, 0, 0, 0.4);
  }
}

.crashed_captures {
  span {
    color: rgba(110, 0, 0, 0.7);
  }
}

</style>
