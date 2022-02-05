<template>
  <div class="chart_tubes_notes d-flex">
    <div class="d-block">

      <Chart
      @addMeasurement="addMeasurement"
      @removeMeasurement="removeMeasurement"
      />

      <div class="notes ms-4">
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

    <TubesList class="d-flex"/>

  </div>

  <div class="mt-2 ms-4">
    <MeasurementsList/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '@/components/Chart.vue';
import MeasurementsList from '@/components/MeasurementsList.vue';
import TubesList from '@/components/TubesList.vue';

export default defineComponent({
  name: 'Workspace',
  components: {
    Chart,
    MeasurementsList,
    TubesList,
  },
  computed: {
    notes: {
      get() {
        return this.$store.state.notes;
      },
      set(value: string) {
        this.$store.dispatch('SET_NOTES', { newNotes: value });
      },
    },
  },
  methods: {
    addMeasurement(uAnode: number) {
      this.$store.dispatch('ADD_MEASUREMENT', { uAnode });
    },
    removeMeasurement(uAnode: number) {
      this.$store.dispatch('REMOVE_MEASUREMENT', { uAnode });
    },
  },
});
</script>

<style lang="scss" scoped>

textarea {
  width: 740px;
  height: 100px;
  resize: none;
  font-size: 18px;
}

@media screen and (max-width:1300px) {
  .chart_tubes_notes {
      flex-direction: column;
  }
}

</style>
