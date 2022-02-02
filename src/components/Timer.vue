<template>
    <div class="container">
        <audio ref="audioBell">
          <source src="@/assets/bell.mp3" type="audio/mpeg">
        </audio>
        <span
            class="info_bulle"
            title="Tant que le minuteur est actif, les nouvelles captures seront mises en attente.
            Activez le pendant le chauffage des lampes">
                ?
        </span>
        <h3>Minuteur</h3>
        <p class="seconds" :style="setupTimerTextColor">
            {{ secondsLeft }}
        </p>
        <div class="reset">
            <input
            @change="updateInputValid"
            @keypress="durationInputKeypressed"
            @input="updateInputValid"
            type="text" ref="inputDuration"/>
            <span>secondes</span>
            <button ref="btnReset" :disabled="!inputValid" @click="resetTimer">Reset</button>
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
  mounted() {
    if (this.$refs.audioBell !== undefined) {
      (this.$refs.audioBell as HTMLAudioElement).load();
    }
  },
  computed: {
    secondsLeft() {
      if (this.timer !== undefined) {
        if (this.timer.secondsLeft === 0 && this.$refs.audioBell !== undefined) {
          (this.$refs.audioBell as HTMLAudioElement).play();
        }
        return this.timer.secondsLeft.toLocaleString('fr', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
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
    durationInputKeypressed(evt: any) {
      this.updateInputValid();
      // If enter is pressed, click the button
      if (evt.keyCode === 13) {
        (this.$refs.btnReset as HTMLButtonElement).click();
      }
    },
  },
});
</script>

<style lang="scss" scoped>

.container {
  padding: 1em;
  display: inline-block;
  border: 1px solid black;
  text-align: center;
  position: relative;
  opacity: 25%;
  transition: opacity 0.2s ease-out 100ms;

  > * {
    cursor: default;
  }
}

.container:hover {
  opacity: 100%;
}

h3 {
  margin: 0;
}

.info_bulle {
  width: 1.1em;
  margin: 0;
  border: 1px solid black;
  border-radius: 100%;
  padding: 0.1em;
  background-color: rgb(169, 203, 204, 0.5);
  font-weight: bold;
  position: absolute;
  right: 0.7em;
  cursor: help;
}

input {
  width: 2em;
  text-align: center;
}

.seconds {
  font-size: 28px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.reset {
    display: block;

    > * {
        display: inline;
        margin-left: 0.4em;
    }
}

</style>
