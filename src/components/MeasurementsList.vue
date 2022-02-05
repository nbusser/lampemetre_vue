<template>
  <div class="d-block">
    <div class="header">
      <h2>Mesures</h2>
      <div class="btn-group ms-3 align-bottom" role="group" aria-label="measurement-control">
        <button type="button" class="btn btn-dark"
        @click="promptMeasurementsModal.show()"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
        <button type="button" class="btn btn-outline-dark"
        @click="clearMeasurementsModal.show()"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
    <ul class="mt-3">
      <li class="d-inline-block me-3 mb-3"
      v-for="uAnode in this.measurements" :key="uAnode">
        <Measurement :uAnode="uAnode"
        @measurementRemoved="removeMeasurement(uAnode)"
        />
      </li>
    </ul>
  </div>

  <ModalConfirm
  body="Voulez vous vraiment supprimer toutes les mesures ?"
  @confirmed="clearMeasurements"
  @modalCreated="this.clearMeasurementsModal = $event"
  />

  <ModalPromptNumbers
  title="Nouvelle mesure"
  @modalCreated="this.promptMeasurementsModal = $event"
  @promptDone="addMeasurements">
    <p>Entrez la <b>tension anode</b> pour laquelle vous souhaitez effectuer la capture.</p>
    <p>Appuyez sur ',' pour entrer une autre valeur de tension anode.</p>
  </ModalPromptNumbers>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';
import Measurement from '@/components/Measurement.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import ModalPromptNumbers from '@/components/ModalPromptNumbers.vue';

export default defineComponent({
  name: 'MeasurementsList',
  components: {
    Measurement,
    ModalConfirm,
    ModalPromptNumbers,
  },
  data: () => ({
    clearMeasurementsModal: null as Modal | null,
    promptMeasurementsModal: null as Modal | null,
  }),
  computed: {
    measurements(): Set<number> {
      return this.$store.state.measurements;
    },
  },
  methods: {
    promptMeasurement() {
      const promptedUanode = prompt('Tension anode de mesure');
      if (promptedUanode !== null) {
        const uAnode = Number.parseFloat(promptedUanode);
        if (!Number.isNaN(uAnode)) {
          this.addMeasurement(uAnode);
        }
      }
    },
    addMeasurements(uAnodes: number[]) {
      uAnodes.forEach((uAnode: number) => {
        this.addMeasurement(uAnode);
      });
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
});
</script>

<style lang="scss" scoped>

ul {
  list-style: none;
}

</style>
