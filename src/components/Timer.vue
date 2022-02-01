<template>
    <div>
        <div class="header">
            <h3>Minuteur</h3>
            <p
            class="info"
            title="Tant que le minuteur est actif, les nouvelles captures seront mises en attente.
            Activez le pendant le chauffage des lampes">
                ?
            </p>
        </div>
        <p class="seconds" :style="setupTimerTextColor">
            {{ secondsLeft }}
        </p>
        <div class="reset">
            <button :disabled="!inputValid" @click="resetTimer">Reset</button>
            <input
            @change="updateInputValid"
            @keypress="updateInputValid"
            @input="updateInputValid"
            type="text" ref="inputDuration"/>
            <span>secondes</span>
        </div>
    </div>
</template>

<script lang="ts">

import Timer from '@/Timer';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Timer',
  data: () => ({
    errorMessage: null as string | null,
    inputValid: false as boolean,
  }),
  props: {
    timer: Timer,
  },
  computed: {
    secondsLeft() {
      if (this.timer !== undefined) {
        return this.timer.secondsLeft;
      }
      return '';
    },
    setupTimerTextColor() {
      if (!this.timer?.isOver()) {
        return {
          color: '#CF2400',
        };
      }
      return {};
    },
  },
  methods: {
    resetTimer() {
      if (this.timer !== undefined) {
        const durationText = (this.$refs.inputDuration as HTMLInputElement).value;
        const duration = Number.parseInt(durationText, 10);
        this.timer.resetTimer(duration);
        this.errorMessage = null;
      }
    },
    updateInputValid() {
      let res = false;
      if (this.$refs.inputDuration !== undefined) {
        const durationText = (this.$refs.inputDuration as HTMLInputElement).value;
        const duration = Number.parseInt(durationText, 10);
        res = !Number.isNaN(duration);
      }

      this.inputValid = res;
    },
  },
});
</script>

<style lang="scss" scoped>

.reset {
    display: block;

    > * {
        display: inline;
    }
}

</style>
