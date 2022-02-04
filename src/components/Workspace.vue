<template>
  <div class="workspace">
    <div class="chart_tubes_notes">
      <Chart
      @addMeasurement="addMeasurement"
      @removeMeasurement="removeMeasurement"
      />

      <div class="tubes_notes">
        <div class="notes">
          <div class="notes_flex">
            <div class="header">
              <h3> Notes </h3>
              <i class="info_bulle bi bi-question-circle-fill text-secondary"
              v-tooltip
              title="Utilisez cette zone de texte pour écrire les notes de votre choix.
              Celles ci seront sauvegardées avec le projet"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom">
              </i>
            </div>
            <textarea v-model="notes"></textarea>
          </div>
        </div>

        <div class="tubes">
          <div class="header">
            <h2>Tubes</h2>
            <div class="btn-group" role="group" aria-label="tubes-control">
              <button type="button" class="btn btn-dark"
              @click="addTube()">
                <i class="bi-plus-lg"></i>
              </button>
              <button type="button" class="btn btn-outline-dark"
              @click="clearTubes()">
                <i class="bi-trash"></i>
              </button>
            </div>
          </div>
          <ul class="model_list">
            <li class="tube" v-for="tube, i in this.tubes" :key="i">
              <Tube :tube="tube"
              @selectedCaptureChanged="selectCaptureTube(tube, $event)"
              @captureRequested="runCapture(tube, $event)"
              @captureRemoved="removeCapture(tube, $event)"
              @tubeRemoved="removeTube(tube)"
              @smoothingFactorChanged="changeSmoothingFactor(tube, $event)"
              @pendingCaptureCanceled="cancelPendingCapture(tube, $event)"
              @crashedCaptureRemoved="removeCrashedCapture(tube, $event)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="measurements">
      <div class="header">
        <h2>Mesures</h2>
        <div class="btn-group" role="group" aria-label="measurement-control">
          <button type="button" class="btn btn-dark"
          @click="promptMeasurement()"
          >
            <i class="bi-plus-lg"></i>
          </button>
          <button type="button" class="btn btn-outline-dark"
          @click="clearMeasurements()"
          >
            <i class="bi-trash"></i>
          </button>
        </div>
      </div>
      <ul class="model_list">
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

export default defineComponent({
  name: 'Workspace',
  components: {
    Chart,
    Tube,
    Measurement,
  },
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
    measurements(): Set<number> {
      return this.$store.state.measurements;
    },
    notes: {
      get() {
        return this.$store.state.notes;
      },
      set(value) {
        this.$store.dispatch('SET_NOTES', { newNotes: value });
      },
    },
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
      this.$store.dispatch('CREATE_CAPTURE_ASYNC', {
        tube,
        uGrid,
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
    cancelPendingCapture(tube: ModelTube, uGrid: number) {
      this.$store.dispatch('CANCEL_PENDING_CAPTURE', {
        tube,
        uGrid,
      });
    },
    removeCrashedCapture(tube: ModelTube, uGrid: number) {
      this.$store.dispatch('REMOVE_CRASHED_CAPTURE', {
        tube,
        uGrid,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.chart_tubes_notes {
  display: flex;
}

.tubes_notes {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.workspace {
  margin-left: 1em;
}

textarea {
  font-size: 18px;
}

.notes {
  display: flex;
  justify-content: flex-end;
  width: 100%;

  .header {
    margin-bottom: 0.6em;
  }

  textarea {
    width: 600px;
    height: 100px;
    resize: none;
  }
}

.notes_flex {
  flex-grow: 0.06;
}

.tubes {
  .header {
    margin-left: 0.8em;
  }

  overflow-y: auto;
  height: 34em;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 1em;
    gap: 0.5em;
  }
}

.tube {
  border: 2px solid black;
  border-radius: 2%;
  /*
   * Bootstrap's grid system is quite stiff and doesn't allow
   * the user to precisely set the width of the components.
   * Thus, I decided to reduce the size of each grid by setting
   * hard-coded width. Also, for some reason, the grid's content
   * cannot be properly centered and is abnormaly wide in the
   * right side. Thus, I decided to apply a smaller padding to
   * the right in order to balance the display.
   * Consider to use bootstrap's cards in future version.
   */
  width: 14.5em;
  padding: 1em 0.3em 1em 1em;
}

.header {
  .btn-group {
    margin-left: 0.8em;
    vertical-align: bottom;
  }
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

.model_list {
  margin-top: 0.8em;
}

 @media screen and (max-width:1300px) {
    .chart_tubes_notes {
        flex-direction: column;
    }

    .notes {
      justify-content: flex-start;
    }

    .tubes {
      height: 100%;
    }
 }
</style>
