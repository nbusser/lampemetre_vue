<template>
  <ModalPopup
  @modalCreated="$emit('modalCreated', $event)"
  @enterPressed="sendResults"
  @show="resetModal"
  @shown="focusFirstInput"
  >
      <div class="modal-header">
        <h5 class="modal-title">
          {{ title }}
        </h5>
        <button type="button"
        class="btn-close"
        data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <slot></slot>
        <div class="inputs">
            <div v-for="input, i in this.inputs" :key="i">
                <div class="input-group mb-3">
                    <span class="input-group-text" v-if="this.sign !== undefined">{{ sign }}</span>
                    <input type="text"
                    class="form-control"
                    :ref="'prompt' + i"
                    :class="inputValid(i) ? '' : 'is-invalid'"
                    v-model="this.inputs[i]"
                    @keypress="updateInputs($event, i)"/>
                    <span class="input-group-text">V</span>

                    <button class="btnRemovePrompt btn btn-outline-dark"
                    :disabled="i === 0 && this.inputs.length === 1"
                    type="button"
                    @click="deleteInput(i)"
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal">
          Annuler
        </button>
        <button
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        ref="confirmBtn"
        @click="sendResults">
          Valider
        </button>
      </div>
  </ModalPopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

export default defineComponent({
  name: 'ModalPromptNumbers',
  components: {
    ModalPopup,
  },
  props: {
    title: String,
    sign: String,
  },
  emits: [
    'modalCreated',
    'promptDone',
  ],
  data: () => ({
    inputs: [''] as string[],
  }),
  methods: {
    updateInputs(evt: any, indexInput: number) {
      if (evt.keyCode === 44) {
        // Pressing comma on the last input creates a new input
        if (indexInput === this.inputs.length - 1) {
          this.inputs.push('');
          // Waits a tick so the template created the fresh new input
          this.$nextTick(() => {
            const lastInput = (this.$refs[`prompt${this.inputs.length - 1}`] as HTMLElement[])[0];
            lastInput.focus();
          });
        }
        evt.preventDefault();
      } else if (evt.keyCode === 32) {
        evt.preventDefault();
      }
    },
    deleteInput(index: number) {
      this.inputs.splice(index, 1);
    },
    inputValid(indexInput: number) {
      const input = this.inputs[indexInput];
      if (input === '') {
        return true;
      }
      const uGrid = Number.parseFloat(input);
      return !Number.isNaN(uGrid);
    },
    sendResults() {
      const uGrids = this.inputs.map(
        (input: string) => Number.parseFloat(input),
      ).filter(
        (uGrid: number) => !Number.isNaN(uGrid),
      );
      this.$emit('promptDone', uGrids);
    },
    resetModal() {
      this.inputs = [''];
    },
    focusFirstInput() {
      const input = ((this.$refs.prompt0 as any)[0] as HTMLInputElement);
      input.focus();
    },
  },
});
</script>

<style lang="scss" scoped>

</style>
