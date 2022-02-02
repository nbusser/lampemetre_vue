<template>
  <HeaderBar/>
  <Workspace/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderBar from '@/components/HeaderBar.vue';
import Workspace from '@/components/Workspace.vue';

export default defineComponent({
  name: 'App',
  components: {
    Workspace,
    HeaderBar,
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

.error {
  color: rgb(139, 0, 0);
  margin-left: 0.4em;
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
