<template>
    <div class="save_load">
      <h3>{{ title }}</h3>
      <div class="buttons btn-group" role="group" aria-label="Save Load">
        <button type="btn" class="btn btn-light"
        @click="save">
          {{ saveName }}
        </button>
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

.save_load {
  text-align: center;
}
.buttons {
  :nth-child(n+2) {
    margin-left: 0.4em;
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
