<template>
    <!--Hidden input text field used for file browsing. Triggered by clicking the button-->
    <button @click="clickHandler">{{ text }}</button>
    <input @change="fileSelected" type="file" name="file" :accept="accept" ref="fileInput"/>
    <span class="error" v-if="this.displayError">
      Une erreur est survenue pendant la lecture du fichier
    </span>
    <span class="error" v-if="this.errorMessage !== undefined && this.errorMessage !== null">
      {{ errorMessage }}
    </span>

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
    errorMessage: String,
  },
  emits: [
    'fileLoaded',
  ],
  data: () => ({
    displayError: false as boolean,
  }),
  methods: {
    clickHandler() {
      const input = this.$refs.fileInput as HTMLInputElement;
      input.click();
    },
    fileSelected(evt: any) {
      if (evt.target === null) {
        this.displayError = true;
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
          this.displayError = true;
          return;
        }
        // Resets input field
        // eslint-disable-next-line no-param-reassign
        const hiddenInput = this.$refs.fileInput as HTMLInputElement;
        hiddenInput.value = '';
        this.displayError = false;

        // If no error, sends the opened file to the callback
        this.$emit('fileLoaded', event.target.result);
      });

      // Reads the file using the appropriate method
      if (this.readMethod === ReadMethod.ArrayBuffer) {
        reader.readAsArrayBuffer(file);
      } else if (this.readMethod === ReadMethod.Text) {
        reader.readAsText(file);
      } else {
        this.displayError = true;
        throw Error('No read method given as prop');
      }
    },
  },
});

</script>

<style lang="scss" scoped>

input {
  display: none;
}

.error {
  color: rgb(139, 0, 0);
  margin-left: 0.4em;
}

</style>
