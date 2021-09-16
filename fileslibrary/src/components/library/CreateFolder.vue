<template>
  <v-dialog v-model="dialog" persistent width="40vw" style="height: 50vh">
    <v-card justify="center">
      <v-card-title class="justify-center">
        <span class="text-h5">create folder</span>
      </v-card-title>
      <v-checkbox v-if="isLoggedIn" v-model="isPublic" label="public" class="pl-13" />
      <v-col cols="11" class="pl-13">
        <v-combobox
            v-if="!isPublic"
            v-model="selectedUsers"
            :items="userNames"
            label="Users to share with"
            multiple
            chips
        ></v-combobox>
      </v-col>
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
import itemsAPI from "../../API/itemsAPI.js";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      fileName: "",
      isPublic: true,
      selectedUsers: [],
    };
  },
  props: {
    dialog: Boolean,
    users: Array,
  },
  methods: {
    async createFolder() {
      if (this.fileName.length > 0) {
        const data = {
          name: this.fileName,
          isPublic: this.isPublic,
          parentItem: this.getCurrentDirectoryId === -1 ? null : this.getCurrentDirectoryId,
          creator: this.getUserId,
          usersToShare: this.selectedUsers.map((userName) => {
            return this.users.find(user => user.userName === userName).id;
          }),
        };
        const isSuccessful = await itemsAPI.createFolder(data);
        if (isSuccessful) {
          Swal.fire("Success", "folder created", "success");
          this.$emit('update');
        } else {
          Swal.fire("Error", "error creating the folder", "error");
        }
      } else {
        console.log("file name is empty");
      }
      this.$emit("update:dialog", false);
    },
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId', 'getCurrentDirectoryId']),
    userNames() {
      return this.users.map(user => user.userName);
    },
  },
};
</script>

<style></style>
