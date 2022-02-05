<template>
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
        @click="clearMeasurementsModal.show()"
        >
          <i class="bi-trash"></i>
        </button>
      </div>
    </div>
    <ul>
      <li class="measurement" v-for="uAnode in this.measurements" :key="uAnode">
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

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';
import Measurement from '@/components/Measurement.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';

export default defineComponent({
  name: 'MeasurementsList',
  components: {
    Measurement,
    ModalConfirm,
  },
  data: () => ({
    clearMeasurementsModal: null as Modal | null,
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

.header {
    margin-left: 0.8em;

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
  margin-top: 0.8em;
}

</style>
