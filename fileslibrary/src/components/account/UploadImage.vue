<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card style="border-radius: 15px">
      <v-card-title>
        <span class="text-h5">Upload Image</span>
      </v-card-title>
      <v-card-text>
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
            @click.stop=""
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapMutations, mapState} from "vuex";
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
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
    async saveUser() {
      const user = await usersAPI.updateUser(updatedFields);
      if (user) {
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