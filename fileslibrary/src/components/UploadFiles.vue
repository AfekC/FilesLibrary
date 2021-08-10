<template>
  <v-dialog v-model="dialog" persistent width="40vw" style="height: 50vh">
    <v-card :loading="loading" justify="center">
      <template slot="progress">
        <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
        ></v-progress-linear>
      </template>
      <v-card-title class="justify-center">
        <span class="text-h5">select your files</span>
      </v-card-title>
      <v-checkbox v-if="isLoggedIn" v-model="isPublic" label="public" class="pl-13" />
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
        show-size
        style="width: 30vw"
        class="ma-2 ml-11"
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
import itemsAPI from "../API/itemsAPI.js";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isPublic: true,
      files: [],
      loading: false,
    };
  },
  props: {
    dialog: Boolean,
  },
  methods: {
    async uploadFiles() {
      if (this.files) {
        this.loading = true;
        let formData = new FormData();

        // files
        for (let file of this.files) {
          formData.append("files", file, file.name);
        }

        // additional data
        formData.append("isPublic", this.isPublic);
        formData.append("creator", this.getUserId);
        formData.append("parentItem", this.getCurrentDirectoryId === -1 ? null : this.getCurrentDirectoryId);

        const isSuccess = await itemsAPI.uploadFiles(formData);
        if (isSuccess) {
          Swal.fire("Success", "all files uploaded", "success");
          this.$emit('update');
        } else {
          Swal.fire("Error", "error uploading one or more files", "error");
        }
        this.loading = false;
        this.$emit("update:dialog", false);
      } else {
        console.log("there are no files.");
      }
    },
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId', 'getCurrentDirectoryId']),
  },
};
</script>

<style></style>
