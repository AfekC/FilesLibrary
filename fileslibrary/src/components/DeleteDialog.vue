<template>
  <v-dialog v-model="dialog" persistent width="30vw" style="height: 50vh">
    <v-card justify="center">
      <v-card-title class="justify-center">
        <span class="text-h5"> {{ `Delete ${name}?` }}</span>
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn
          color="blue darken-1"
          text
          @click.stop="$emit('update:dialog', false)"
        >
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click.stop="deleteItem">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import itemsAPI from "../API/itemsAPI.js";
import Swal from "sweetalert2";

export default {
  props: {
    dialog: Boolean,
    id: Number,
    name: String,
  },
  methods: {
    async deleteItem() {
      const isSuccessful = await itemsAPI.deleteItem(this.id);
      if (isSuccessful) {
        Swal.fire("Success", "item deleted", "success");
        this.$emit('update');
      } else {
        Swal.fire("Error", "error delete item", "error");
      }
      this.$emit("update:dialog", false);
    },
  },
};
</script>

<style></style>
