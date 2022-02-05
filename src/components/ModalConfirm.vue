<template>
  <ModalPopup
  @modalCreated="$emit('modalCreated', $event)"
  @enterPressed="$emit('confirmed')">
    <div class="modal-header">
      <h5 class="modal-title">Confirmation</h5>
      <button type="button"
      class="btn-close"
      data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
      {{ body }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
      <button
      type="button"
      class="btn btn-primary"
      data-bs-dismiss="modal"
      @click="$emit('confirmed')">
        Oui
      </button>
    </div>
  </ModalPopup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

export default defineComponent({
  name: 'ModalConfirm',
  components: {
    ModalPopup,
  },
  props: {
    body: String,
  },
  emits: [
    'confirmed',
    'modalCreated',
  ],
});
</script>
