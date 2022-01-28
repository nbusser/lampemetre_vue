<template>
    <div class="tube">
        <div class="header">
            <h2 class="tube_title">{{ tube.name }}</h2>
            <button class="btn_remove_tube" @click="removeTube()">-</button>
        </div>
        <div class="all_captures">
            <div class="header">
                <h3 class="title">Captures</h3>
                <button class="add_capture" @click="runCapture()">+</button>
            </div>
            <ul class="captures_list">
                <li class="item_capture"
                    v-for="[uGrid, capture] in tube.captures" :key="uGrid"
                >
                    <div>
                        <label class="radio_select_capture">
                            <input type="radio"
                            v-model="selectedCapture"
                            :value="capture"
                            @change="selectedCaptureChanged()">
                        </label>
                        <div>
                            <span>{{ capture.toString() }}</span>
                            <button class="remove_capture" @click="removeCapture(uGrid)">-</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '../model/ModelTube';

export default defineComponent({
  name: 'Tube',
  props: {
    tube: ModelTube,
  },
  data: () => ({
    selectedCapture: -1,
  }),
  methods: {
    runCapture(): void {
      if (this.$props.tube !== undefined) {
        // eslint-disable-next-line no-alert
        const uGridText = prompt('Tension grille');
        if (uGridText === null) { return; }
        const uGrid = Number.parseFloat(uGridText);
        if (Number.isNaN(uGrid)) { return; }

        this.$store.dispatch('CREATE_CAPTURE', {
          tube: this.$props.tube,
          uAnode: [1, 2, 3, 4],
          uGrid,
          iCathode: [5, 6, 7, 8],
        });
      }
    },
    removeCapture(uGrid: number): void {
      if (this.$props.tube !== undefined) {
        this.$store.dispatch('DELETE_CAPTURE', {
          tube: this.$props.tube,
          uGrid,
        });
      }
    },
    removeTube(): void {
      if (this.$props.tube !== undefined) {
        const { tube } = this.$props;
        this.$store.dispatch('REMOVE_TUBE', { tube });
      }
    },
    selectedCaptureChanged(): void {
      if (this.$props.tube !== undefined) {
        const { tube } = this.$props;
        this.$store.dispatch('SELECT_CAPTURE_TUBE', { tube, uGrid: this.selectedCapture });
      }
    },
  },
});
</script>

<style lang="scss" scoped>

.tube {
    display: inline-block;
}

.header > * {
    display: inline;
}

.item_capture {
    div {
        display: inline;
    }
}

.captures_list {
    list-style: none;
}

button {
    margin-left: 1em;
    vertical-align: text-bottom;
}

</style>
