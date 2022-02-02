<template>
    <div class="container">
      <h3>{{ title }}</h3>
      <div class="buttons">
        <button @click="save">{{ saveName }}</button>
        <LoadFile
        :text="loadName"
        :accept="accept"
        :readMethod="readMethod"
        :errorMessage="errorMessage"
        @fileLoaded="load"
        />
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadFile from '@/components/LoadFile.vue';

export default defineComponent({
  name: 'SaveLoad.vue',
  components: {
    LoadFile,
  },
  props: {
    title: String,
    saveName: String,
    loadName: String,
    accept: String,
    readMethod: String,
    errorMessage: String,
  },
  methods: {
    save() {
      this.$emit('save');
    },
    load(file: string | ArrayBuffer) {
      this.$emit('load', file);
    },
  },
});
</script>

<style lang="scss" scoped>

.container {
  text-align: center;
}
.buttons {
  :nth-child(n+1) {
    margin-left: 0.2em;
  }
}

button {
  font-size: 15px;
}

h3 {
  margin: 0;
  margin-bottom: 0.3em;
}

</style>
