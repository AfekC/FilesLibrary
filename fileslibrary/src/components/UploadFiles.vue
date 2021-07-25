<template>
  <v-dialog v-model="dialog" persistent width="40vw" style="height: 50vh">
    <v-card justify="center">
      <v-card-title class="justify-center">
        <span class="text-h5">select your files</span>
      </v-card-title>
      <v-file-input
        v-model="files"
        width="30vw"
        color="deep-purple accent-4"
        counter
        label="File input"
        multiple
        placeholder="Select your files"
        prepend-icon="mdi-paperclip"
        outlined
        style="width: 30vw"
        class="ma-5 ml-13"
      >
        <template v-slot:selection="{ index, text }">
          <v-chip
            v-if="index < 2"
            color="deep-purple accent-4"
            dark
            label
            small
          >
            {{ text }}
          </v-chip>

          <span
            v-else-if="index === 2"
            class="text-overline grey--text text--darken-3 mx-2"
          >
            +{{ files.length - 2 }} File(s)
          </span>
        </template>
      </v-file-input>
      <v-card-actions class="justify-center">
        <v-btn
          color="blue darken-1"
          text
          @click.stop="$emit('update:dialog', false)"
        >
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click.stop="uploadFiles">
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      files: [],
    };
  },
  props: {
    dialog: Boolean,
  },
  methods: {
    uploadFiles() {
      this.$emit("update:dialog", false);
      if (this.files) {
        let formData = new FormData();

        // files
        for (let file of this.files) {
          formData.append("files", file, file.name);
        }

        // additional data
        formData.append("is_public", true);
        formData.append("creator", 1);
        formData.append("parent_dir", 1);

        axios
          .post("http://localhost:4000/directory/upload-files", formData)
          .then((response) => {
            console.log("Success!");
            console.log({ response });
          })
          .catch((error) => {
            console.log({ error });
          });
      } else {
        console.log("there are no files.");
      }
    },
  },
};
</script>

<style></style>
