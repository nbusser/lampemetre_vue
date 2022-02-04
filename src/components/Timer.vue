<template>
    <div class="timer">
        <audio ref="audioBell">
          <source src="@/assets/bell.mp3" type="audio/mpeg">
        </audio>
        <div class="timer_info">
          <button
          type="button"
          class="btn btn-lg btn-secondary"
          ref="popoverBtn"
          data-bs-placement="bottom"
          v-on="{
            'shown.bs.popover': () => {this.popoverInitialized = true},
          }"
          >
          Minuteur
          <i class="bi bi-stopwatch"></i>
        </button>

          <span class="seconds badge user-select-none"
          :class="{'bg-secondary': timerIsOver,
          'bg-danger': !timerIsOver}"
          ref="infoBulle"
          title="Tant que le minuteur est actif, les nouvelles captures seront mises en attente.
          Activez le pendant le chauffage des lampes"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom">
            {{ secondsLeft }}
          </span>
        </div>

        <div ref="popoverContent"
        :style=setPopoverDisplay>
          <div class="input-group mb-3">
            <input class="form-control"
            @change="updateInputValid"
            @keypress="durationInputKeypressed"
            @input="updateInputValid"
            value="60" type="text" ref="inputDuration"/>

            <span class="input-group-text">
              secondes
            </span>

            <button type="button" class="btn btn-outline-secondary"
            ref="btnReset"
            :disabled="!inputValid"
            @click="resetTimer">
              Reset
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
    </div>
</template>

<script lang="ts">

import Timer from '@/Timer';
import { defineComponent } from 'vue';
import { Popover, Tooltip } from 'bootstrap';

export default defineComponent({
  name: 'Timer',
  data: () => ({
    popover: null as Popover | null,
    popoverInitialized: false as boolean,
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

    const infoBulle = this.$refs.infoBulle as HTMLSpanElement;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tooltip = new Tooltip(infoBulle);

    const popoverBtn = this.$refs.popoverBtn as HTMLButtonElement;
    const popoverContent = this.$refs.popoverContent as HTMLDivElement;
    this.popover = new Popover(popoverBtn, {
      sanitize: false,
      html: true,
      content: popoverContent,
    });
  },
  computed: {
    timerIsOver() {
      return this.timer?.isOver();
    },
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
    setPopoverDisplay() {
      const display = this.popoverInitialized ? '' : 'none';
      return { display };
    },
  },
  methods: {
    resetTimer() {
      if (this.timer !== undefined) {
        const durationText = (this.$refs.inputDuration as HTMLInputElement).value;
        const duration = Number.parseInt(durationText, 10);
        this.timer.resetTimer(duration);
        this.errorMessage = null;

        (this.popover as Popover).hide();
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
      console.log('big ping');
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

.timer {
  display: inline-block;
  text-align: center;
  position: relative;
}

.timer_info {
  display: block;

  > * {
    display: inline;
    margin-left: 0.4em;
    vertical-align: middle;
  }
}

.seconds {
  font-size: 24px;
  font-family: monospace;
}

</style>
