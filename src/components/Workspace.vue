<template>
  <div>
    <p>Test</p>
    <p>{{ msg }}</p>

    <div class="tubes">
      <div class="header">
        <h2>Tubes</h2>
        <button @click="addTube()">+</button>
      </div>
      <ul>
        <li class="tube" v-for="tube in this.tubes" :key="tube">
          <Tube :tube="tube"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelTube from '@/model/ModelTube';
import Tube from './Tube.vue';

export default defineComponent({
  name: 'Workspace',
  components: {
    Tube,
  },
  props: {
    msg: String,
  },
  methods: {
    addTube(): void {
      // eslint-disable-next-line no-alert
      const tubeName = prompt('Nom du tube');
      if (tubeName !== null) {
        const tube: ModelTube = new ModelTube(tubeName);
        this.$store.dispatch('ADD_TUBE', { tube });
      }
    },
  },
  computed: {
    tubes(): ModelTube[] {
      return this.$store.state.tubes;
    },
  },
});
</script>

<style lang="scss" scoped>

.header {
  > * {
    display: inline;
  }

  button {
    margin-left: 1em;
    vertical-align: text-bottom;
  }
}

</style>
