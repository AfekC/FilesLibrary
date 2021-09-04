<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card style="border-radius: 15px">
      <v-card-title>
        <span class="text-h5">Upload Image</span>
      </v-card-title>
      <v-card-text>
        <v-img v-if="fileInB64"
              :src="fileInB64"
               contain
               height="130"
               weight="130"/>
        <v-file-input
            v-model="file"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an Image"
            prepend-icon="mdi-camera"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click.stop="$emit('update:dialog', false)"
        >
          Close
        </v-btn>
        <v-btn
            :disabled="!file"
            color="blue darken-1"
            text
            @click.stop="saveImage()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapMutations} from "vuex";
import usersAPI from "../../API/usersAPI";
import Swal from "sweetalert2";

export default {
  name: "UploadImage",
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      file: null,
      fileInB64: null,
    };
  },
  watch: {
    async file() {
      if (this.file) {
        this.fileInB64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      } else {
        this.fileInB64 = null;
      }
    },
  },
  methods: {
    ...mapMutations(["setUserImage"]),
    async saveImage() {
      let formData = new FormData();
      formData.append("image", this.file, this.file.name);
      if (await usersAPI.updateImage(formData)) {
        this.setUserImage(this.fileInB64);
        this.$emit('update:dialog', false);
        Swal.fire("Success", "User Updated Successfully", "success");
      } else {
        Swal.fire("Error", "Error Update User", "error");
      }
    },
  },
}
</script>

<style scoped>

</style>