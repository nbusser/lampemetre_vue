<template>
  <h1>Lampemetre</h1>
  <Workspace msg="Ceci est un prop"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Workspace from './components/Workspace.vue';

export default defineComponent({
  name: 'App',
  components: {
    Workspace,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
