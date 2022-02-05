<template>
    <ModalPopup
    @modalCreated="$emit('modalCreated', $event)"
    @show="resetInput"
    @shown="focusInput">
        <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button"
            class="btn-close"
            data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <slot></slot>
            <input v-model="text" type="text" class="form-control" ref="textInput"/>
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
            @click="sendResult()">
                Oui
            </button>
        </div>
    </ModalPopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

export default defineComponent({
  name: 'ModalPromptText',
  components: {
    ModalPopup,
  },
  emits: [
    'modalCreated',
    'promptDone',
  ],
  props: {
    title: String,
  },
  data: () => ({
    text: '' as string,
  }),
  methods: {
    resetInput() {
      this.text = '';
    },
    focusInput() {
      const textInput = (this.$refs.textInput as HTMLInputElement);
      textInput.focus();
    },
    sendResult() {
      this.$emit('promptDone', this.text);
    },
  },
});
</script>
