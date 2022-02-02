<template>
  <header>
    <h1>Lampemetre</h1>
    <Timer class="timer" :timer="this.$store.state.timer"/>
  </header>
  <Workspace/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Timer from '@/components/Timer.vue';
import Workspace from '@/components/Workspace.vue';

export default defineComponent({
  name: 'App',
  components: {
    Workspace,
    Timer,
  },
});
</script>

<style lang="scss">

body {
  margin: 0;
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgb(183, 229, 255);
  border-bottom: 1px solid black;
  margin-bottom: 1em;

  > * {
    display: inline;
  }

  h1 {
    font-size: 50px;
    margin: 0;
    padding: 0.1em 0.4em;
  }

  .timer {
    float: right;
    vertical-align: middle;
    margin-top: 0.8em;
    margin-right: 2em;
  }
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
