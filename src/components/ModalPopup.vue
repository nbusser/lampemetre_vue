<template>
    <div
    class="modal fade"
    ref="modal"
    tabindex="-1"
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
  ],
  mounted() {
    const modalDiv = this.$refs.modal as HTMLElement;
    const modal = new Modal(modalDiv);
    this.$emit('modalCreated', modal);
  },
});
</script>
