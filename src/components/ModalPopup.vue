<template>
    <div
    class="modal fade"
    ref="modal"
    tabindex="-1"
    @keypress="isEnterKey"
    v-on="{
      'show.bs.modal': () => { $emit('show') },
      'shown.bs.modal': () => { $emit('shown') }
      }">
      <div class="modal-dialog">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'ModalPopup',
  emits: [
    'show',
    'shown',
    'modalCreated',
    'enterPressed',
  ],
  data: () => ({
    modal: null as Modal | null,
  }),
  mounted() {
    const modalDiv = this.$refs.modal as HTMLElement;
    this.modal = new Modal(modalDiv);
    this.$emit('modalCreated', this.modal);
  },
  methods: {
    isEnterKey(evt: any) {
      if (evt.keyCode === 13) {
        (this.modal as Modal).hide();
        this.$emit('enterPressed');
      }
    },
  },
});
</script>
