<template>
  <HeaderBar
  @errorTriggered="triggerError"
  />
  <Workspace/>

<div class="toast-container position-absolute p-3 top-50 end-0 translate-middle-y">
  <div ref="errorToast" class="toast" role="alert" data-bs-delay="4000">
      <div class="toast-header">
        <i class="text-danger bi bi-exclamation-square-fill rounded me-2"></i>
        <strong class="me-auto">{{ errorSource }}</strong>
        <small>Erreur</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        {{ errorMessage }}
      </div>
  </div>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderBar from '@/components/HeaderBar.vue';
import Workspace from '@/components/Workspace.vue';
import { Toast } from 'bootstrap';

export default defineComponent({
  name: 'App',
  components: {
    Workspace,
    HeaderBar,
  },
  data: () => ({
    toast: null as Toast | null,
    errorMessage: '' as string,
    errorSource: '' as string,
  }),
  mounted() {
    const toastElement = this.$refs.errorToast as HTMLDivElement;
    this.toast = new Toast(toastElement);
  },
  methods: {
    triggerError(payload: any) {
      const { errorMessage, errorSource } = payload;
      this.errorMessage = errorMessage;
      this.errorSource = errorSource;
      if (this.toast !== null) {
        this.toast.show();
      }
    },
  },
});
</script>

<style lang="scss">

body {
  margin: 0;
}

.header {
  * {
    display: inline;
  }
  :nth-child(n+2) {
    margin-left: 0.5em;
  };
}

.info_bulle {
  font-size: 25px;
  cursor: help;
}

.icon {
  width: 1em;
  height: 1em;
}

</style>
