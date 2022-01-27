<template>
    <div class="tube">
        <div class="header">
            <h2 class="tube_title">{{ tube.name }}</h2>
            <button class="btn_remove_tube" @click="removeTube()">-</button>
        </div>
        <div class="all_captures">
            <div class="header">
                <h3 class="title">Captures</h3>
                <button class="add_capture">+</button>
            </div>
            <ul class="captures_list">
                <li class="item_capture"
                    v-for="[uGrid, capture] in tube.captures" :key="uGrid"
                >
                    <div>
                        <label class="radio_select_capture">
                            <input type="radio" v-model="selectedCapture" :value="uGrid">
                        </label>
                        <div>
                            <span>{{ capture.toString() }}</span>
                            <button class="remove_capture">-</button>
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
  methods: {
    removeTube(): void {
      if (this.$props.tube !== undefined) {
        const { tube } = this.$props;
        this.$store.dispatch('REMOVE_TUBE', { tube });
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
