<template>
  <header>
    <h1>Lampemètre</h1>

    <div class="control_panel">
      <SaveLoad
      title="Projet"
      saveName="Sauver"
      loadName="Charger"
      accept=".json"
      readMethod="text"
      :errorMessage="loadErrorMessage"
      @save="saveJSON"
      @load="loadJSON"
      />

      <SaveLoad
      title="Excel"
      saveName="Exporter"
      loadName="Importer"
      accept=".xlsx"
      readMethod="array_buffer"
      :errorMessage="importErrorMessage"
      @save="exportExcel"
      @load="importExcel"
      />
  </div>

  <Timer class="timer" :timer="this.$store.state.timer"/>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Timer from '@/components/Timer.vue';
import SaveLoad from '@/components/SaveLoad.vue';
import { saveToJSON, loadFromJSON } from '@/SaveLoad';
import { exportToExcel, importFromExcel } from '@/ImportExport';
import ModelTube from '@/model/ModelTube';

export default defineComponent({
  name: 'HeaderBar',
  components: {
    Timer,
    SaveLoad,
  },
  data: () => ({
    loadErrorMessage: null as string | null,
    importErrorMessage: null as string | null,
  }),
  methods: {
    saveJSON() {
      const { tubes, measurements, notes } = this.$store.state;

      saveToJSON(tubes, [...measurements.values()], notes);
    },
    loadJSON(jsonContent: string) {
      try {
        const { tubes, measurements, notes } = loadFromJSON(jsonContent);

        tubes.forEach((tube: ModelTube) => {
          this.$store.dispatch('ADD_TUBE', { tube });
        });
        measurements.forEach((uAnode: number) => {
          this.$store.dispatch('ADD_MEASUREMENT', { uAnode });
        });
        if (notes !== undefined) {
          this.$store.dispatch('SET_NOTES', { newNotes: notes });
        }
        this.loadErrorMessage = null;
      } catch (e: any) {
        this.loadErrorMessage = e.message;
      }
    },
    exportExcel() {
      const { tubes, measurements } = this.$store.state;
      exportToExcel(tubes, [...measurements.values()]);
    },
    async importExcel(excelData: ArrayBuffer) {
      try {
        const tubes = await importFromExcel(excelData);
        tubes.forEach((tube: ModelTube) => {
          this.$store.dispatch('ADD_TUBE', { tube });
        });
        this.importErrorMessage = null;
      } catch (e: any) {
        this.importErrorMessage = e.message;
      }
    },
  },
});
</script>

<style lang="scss" scoped>

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgb(183, 229, 255);
  border-bottom: 1px solid black;
  margin-bottom: 1em;
}

h1 {
  font-size: 50px;
  margin: 0;
  padding: 0.1em 0.4em;

  flex-grow: 1;
}

.control_panel {
  flex-grow: 10;

  > * {
    display: inline-block;
  }

  :nth-child(n+2) {
    margin-left: 0.4em;
  }
}

.timer {
  flex-grow: 1;
}

</style>
