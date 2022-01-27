<template>
  <div>
    <p>Test</p>
    <p>{{ msg }}</p>
    <Tube :tube="yo"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tube from './Tube.vue';
import ModelTube from '../model/ModelTube';

const yo: ModelTube = new ModelTube('test');
yo.createCapture([1, 2, 3], 1, [1, 2, 3]);
export default defineComponent({
  name: 'Workspace',
  data: () => ({ yo }),
  components: {
    Tube,
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
