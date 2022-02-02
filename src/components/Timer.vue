<template>
    <div class="container">
        <audio ref="audioBell">
          <source src="@/assets/bell.mp3" type="audio/mpeg">
        </audio>
        <div class="timer_info">
          <h3>Minuteur</h3>
          <p class="seconds" :style="setupTimerTextColor">
              {{ secondsLeft }}
          </p>
          <span
              class="info_bulle"
              title="Tant que le minuteur est actif, les nouvelles captures seront mises en attente.
              Activez le pendant le chauffage des lampes">
                  ?
          </span>
        </div>
        <div class="control_panel">
            <input
            @change="updateInputValid"
            @keypress="durationInputKeypressed"
            @input="updateInputValid"
            value="60" type="text" ref="inputDuration"/>
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
    this.updateInputValid();
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
  display: inline-block;
  text-align: center;
  position: relative;

  > * {
    cursor: default;
  }
}

.timer_info {
  display: block;

  > * {
    display: inline;
    margin-left: 1em;
    vertical-align: middle;
  }
}

.container:hover {
  .control_panel {
    opacity: 100%;
  }
}

h3 {
  margin: 0;
  font-size: 25px
}

.info_bulle {
    padding: 0.1em 0.4em 0.1em 0.1em;
}

.seconds {
  font-family: Avenir, Helvetica, Arial, monospace;
  font-size: 28px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.control_panel {
  background-color: rgba(223, 239, 255, 0.459);
  margin-top: 1.2em;
  padding: 1em;
  position: absolute;
  opacity: 0%;
  transition: opacity 0.15s ease-out 100ms;

  > * {
      display: inline;
      margin-left: 0.4em;
  }

  input {
    width: 2em;
    text-align: center;
    font-size: 17px;
  }

  span {
    font-size: 17px;
  }

  button {
    font-size: 15px;
  }
}

</style>
