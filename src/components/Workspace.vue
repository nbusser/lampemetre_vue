<template>
  <div class="workspace">
    <div class="d-flex chart_tubes_notes">
      <div class="d-block">

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
        </div>
      </div>

      <TubesList class="d-flex"/>

    </div>

    <div class="mt-2">
      <MeasurementsList/>
    </div>

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

  .header {
    margin-bottom: 0.6em;
  }

  textarea {
    width: 740px;
    height: 100px;
    resize: none;
  }
}

.notes_flex {
  flex-grow: 0.06;
}

 @media screen and (max-width:1300px) {
    .chart_tubes_notes {
        flex-direction: column;
    }
 }
</style>
