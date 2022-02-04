<template>
  <div class="save_load dropdown">
      <a class="btn btn-primary btn-lg dropdown-toggle" role="button"
      data-bs-toggle="dropdown"
      data-bs-auto-close="true">
        Projet
        <i class="bi bi-save"></i>
        <i class="bi"></i>
      </a>
      <ul class="dropdown-menu">
        <li class="dropdown-submenu">
          <a class="dropdown-item"
            tabindex="-1"
          >
            Sauvegarder
          </a>
          <ul class="dropdown-menu">
            <li>
              <a @click="saveJSON" class="dropdown-item">JSON (.json)
                <i class="bi bi-filetype-json"></i>
              </a>
            </li>
            <li>
              <a @click="exportExcel" class="dropdown-item">Excel (.xlsx)
                <i class="bi bi-file-excel"></i>
              </a>
            </li>
          </ul>
        </li>
        <li class="dropdown-submenu">
          <a class="dropdown-item"
            tabindex="-1"
          >
            Charger
          </a>
          <ul class="dropdown-menu">
            <LoadFile
            text="JSON"
            accept=".json"
            readMethod="text"
            iconClass="bi-filetype-json"
            @fileLoaded="loadJSON"
            @errorTriggered="$emit('errorTriggered', $event)"
            />
            <LoadFile
            text="Excel"
            accept=".xlsx"
            readMethod="array_buffer"
            iconClass="bi-file-excel"
            @fileLoaded="importExcel"
            @errorTriggered="$emit('errorTriggered', $event)"
            />
          </ul>
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadFile from '@/components/LoadFile.vue';
import { saveToJSON, loadFromJSON } from '@/SaveLoad';
import { exportToExcel, importFromExcel } from '@/ImportExport';
import ModelTube from '@/model/ModelTube';

export default defineComponent({
  name: 'SaveLoad.vue',
  components: {
    LoadFile,
  },
  events: [
    'errorTriggered',
  ],
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
      } catch (e: any) {
        this.$emit('errorTriggered', { errorMessage: e.message, errorSource: 'Chargement JSON' });
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
      } catch (e: any) {
        this.$emit('errorTriggered', { errorMessage: e.message, errorSource: 'Chargement Excel' });
      }
    },
  },
});
</script>

<style lang="scss" scoped>

.dropdown_header {
  > * {
    display: inline;
  }
}

// Dropdown submenu hacking

.dropdown-submenu {
    position: relative;
}

.dropdown-submenu>.dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -6px;
    margin-left: -1px;
    -webkit-border-radius: 0 6px 6px 6px;
    -moz-border-radius: 0 6px 6px;
    border-radius: 0 6px 6px 6px;
}

.dropdown-submenu:hover>.dropdown-menu {
    display: block;
}

.dropdown-submenu>a:after {
    display: block;
    content: " ";
    float: right;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 5px 0 5px 5px;
    border-left-color: #ccc;
    margin-top: 5px;
    margin-right: -10px;
}

.dropdown-submenu:hover>a:after {
    border-left-color: #fff;
}

.dropdown-submenu.pull-left {
    float: none;
}

.dropdown-submenu.pull-left>.dropdown-menu {
    left: -100%;
    margin-left: 10px;
    -webkit-border-radius: 6px 0 6px 6px;
    -moz-border-radius: 6px 0 6px 6px;
    border-radius: 6px 0 6px 6px;
}

</style>
