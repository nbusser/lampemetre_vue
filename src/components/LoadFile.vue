<template>
  <a class="dropdown-item"
  @click="clickHandler">
    {{ text }} ({{ accept }})
    <i v-if="iconClass !== undefined" class="bi" :class="iconClass"></i>
  </a>
  <!--Hidden input text field used for file browsing. Triggered by clicking the button-->
  <input @change="fileSelected" type="file" name="file" :accept="accept" ref="fileInput"/>
</template>

<script lang="ts">

/*
This helper handles file loading
It is used by both Import and SaveLoad modules
These two features are activated by simply clicking a button.
This function actually manages an hidden input field used to open the file browser.
It then handles the several steps for loading the file and finally runs a callback.
*/

import { defineComponent } from 'vue';

enum ReadMethod {
    ArrayBuffer = 'array_buffer',
    Text = 'text',
}

export default defineComponent({
  name: 'LoadFile',
  props: {
    text: String,
    accept: String,
    readMethod: String,
    iconClass: String,
  },
  emits: [
    'fileLoaded',
    'errorTriggered',
  ],
  methods: {
    clickHandler() {
      const input = this.$refs.fileInput as HTMLInputElement;
      input.click();
    },
    emitError() {
      const errorMessage = 'Une erreur est survenue pendant la lecture du fichier';
      const errorSource = `Chargement de fichier ${this.$props.text as string}`;
      this.$emit('errorTriggered', { errorMessage, errorSource });
    },
    fileSelected(evt: any) {
      if (evt.target === null) {
        this.emitError();
        return;
      }

      // Selected file object
      const file = evt.target.files[0];

      // Reads the selected file
      const reader = new FileReader();

      // Triggered when the file reader finished to read the file
      reader.addEventListener('load', (event) => {
        if (event.target === null
              || event.target.result === null) {
          this.emitError();
          return;
        }
        // Resets input field
        // eslint-disable-next-line no-param-reassign
        const hiddenInput = this.$refs.fileInput as HTMLInputElement;
        hiddenInput.value = '';

        // If no error, sends the opened file to the callback
        this.$emit('fileLoaded', event.target.result);
      });

      // Reads the file using the appropriate method
      if (this.readMethod === ReadMethod.ArrayBuffer) {
        reader.readAsArrayBuffer(file);
      } else if (this.readMethod === ReadMethod.Text) {
        reader.readAsText(file);
      } else {
        this.emitError();
        throw Error('No read method given as prop');
      }
    },
  },
});

</script>

<style lang="scss" scoped>

div {
  display: inline;
}

button {
  font-size: 15px;
}

input {
  display: none;
}

</style>
