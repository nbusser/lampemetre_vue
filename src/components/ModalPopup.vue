<template>
    <div class="modal fade" ref="modal" tabindex="-1">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'ModalPopup',
  emits: [
    'modalCreated',
  ],
  mounted() {
    const modalDiv = this.$refs.modal as HTMLElement;
    const modal = new Modal(modalDiv);
    this.$emit('modalCreated', modal);
  },
});
</script>
