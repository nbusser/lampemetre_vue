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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  * {
    display: inline;
  }
}

.error {
  color: rgb(139, 0, 0);
  margin-left: 0.4em;
}

</style>
