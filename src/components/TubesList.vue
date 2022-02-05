<template>
    <div class="tubes">
        <div class="header ms-4">
          <h2>Tubes</h2>
          <div class="btn-group ms-3 align-bottom" role="group" aria-label="tubes-control">
              <button type="button" class="btn btn-dark"
              @click="this.newTubeModal.show()">
              <i class="bi bi-plus-lg"></i>
              </button>
              <button type="button" class="btn btn-outline-dark"
              @click="this.clearTubesModal.show()">
              <i class="bi bi-trash"></i>
              </button>
          </div>
        </div>
        <ul class="d-flex flex-wrap align-items-stretch gap-3 mt-3">
            <li class="d-flex" v-for="tube, i in this.tubes" :key="i">
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

ul {
  list-style: none;
  max-height: 45em;
  overflow: auto;
}

@media screen and (max-width:1300px) {
    ul {
        max-height: 100%;
    }
}

</style>
