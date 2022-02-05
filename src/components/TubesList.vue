<template>
    <div class="tubes">
        <div class="header">
        <h2>Tubes</h2>
        <div class="btn-group" role="group" aria-label="tubes-control">
            <button type="button" class="btn btn-dark"
            @click="this.newTubeModal.show()">
            <i class="bi-plus-lg"></i>
            </button>
            <button type="button" class="btn btn-outline-dark"
            @click="this.clearTubesModal.show()">
            <i class="bi-trash"></i>
            </button>
        </div>
        </div>
        <ul>
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

    <ModalConfirm
    body="Voulez vous vraiment supprimer tous les tubes ?"
    @confirmed="clearTubes"
    @modalCreated="this.clearTubesModal = $event"
    />

    <ModalPromptText
    title="Nouveau tube"
    @modalCreated="this.newTubeModal = $event"
    @promptDone="createTube"
    >
      <p>Entrez le nom du nouveau tube.</p>
    </ModalPromptText>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tube from '@/components/Tube.vue';
import ModelTube from '@/model/ModelTube';
import ModalConfirm from '@/components/ModalConfirm.vue';
import ModalPromptText from '@/components/ModalPromptText.vue';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'TubesList',
  components: {
    Tube,
    ModalConfirm,
    ModalPromptText,
  },
  data: () => ({
    clearTubesModal: null as Modal | null,
    newTubeModal: null as Modal | null,
  }),
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
  },
  methods: {
    createTube(name: string): void {
      const tube: ModelTube = new ModelTube(name);
      this.$store.dispatch('ADD_TUBE', { tube });
    },
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
    margin-left: 0.8em;

  .btn-group {
    margin-left: 0.8em;
    vertical-align: bottom;
  }
}

ul {
    list-style: none;
    margin-top: 0.8em;

    overflow-y: auto;
    max-height: 30.1em;
    display: flex;
    flex-wrap: wrap;
    padding-left: 1em;
    gap: 0.5em;
}

@media screen and (max-width:1300px) {
    ul {
        max-height: 100%;
    }
}

</style>
