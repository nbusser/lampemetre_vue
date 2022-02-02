<template>
  <header>
    <h1>Lampemetre</h1>
    <Timer class="timer" :timer="this.$store.state.timer"/>
  </header>

  <div class="control save_load">
    <h3>Projet:</h3>
    <button @click="saveJSON">Sauver</button>
    <LoadFile
    text="Charger"
    accept=".json"
    readMethod="text"
    :errorMessage="loadErrorMessage"
    @fileLoaded="loadJSON"
    />
  </div>
  <div class="control export_import">
    <h3>Excel:</h3>
    <button @click="exportExcel">Exporter</button>
    <LoadFile
    text="Importer"
    accept=".xlsx"
    readMethod="array_buffer"
    :errorMessage="importErrorMessage"
    @fileLoaded="importExcel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Timer from '@/components/Timer.vue';
import LoadFile from '@/components/LoadFile.vue';
import { saveToJSON, loadFromJSON } from '@/SaveLoad';
import { exportToExcel, importFromExcel } from '@/ImportExport';
import ModelTube from '@/model/ModelTube';

export default defineComponent({
  name: 'HeaderBar',
  components: {
    Timer,
    LoadFile,
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
  align-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgb(183, 229, 255);
  border-bottom: 1px solid black;
  margin-bottom: 1em;

  h1 {
    font-size: 50px;
    margin: 0;
    padding: 0.1em 0.4em;
  }
}

</style>
