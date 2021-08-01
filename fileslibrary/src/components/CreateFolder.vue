<template>
  <v-dialog v-model="dialog" persistent width="40vw" style="height: 50vh">
    <v-card justify="center">
      <v-card-title class="justify-center">
        <span class="text-h5">create folder</span>
      </v-card-title>
      <v-checkbox v-if="isLoggedIn" v-model="isPublic" label="public" class="ml-10" />
      <v-text-field label="folder name" v-model="fileName" class="ml-10 mr-10" />
      <v-card-actions class="justify-center">
        <v-btn
          color="blue darken-1"
          text
          @click.stop="$emit('update:dialog', false)"
        >
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click.stop="createFolder">
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
      isPublic: false,
      fileName: "",
    };
  },
  props: {
    dialog: Boolean,
  },
  methods: {
    async createFolder() {
      this.$emit("update:dialog", false);
      if (this.fileName.length > 0) {
        const formData = {
          name: this.fileName,
          isPublic: this.isPublic,
          parentItem: 1,
          creator: this.getUserId,
        };
        const isSeccessful = await itemsAPI.createFolder(formData);
        if (isSeccessful) {
          Swal.fire("Success", "folder createsd", "success");
        } else {
          Swal.fire("Error", "error creating the folder", "error");
        }
      } else {
        console.log("there are no files.");
      }
    },
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId']),
  },
};
</script>

<style></style>
