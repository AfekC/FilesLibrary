<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title style="justify-content: center">
          האם אתה רוצה להתנתק?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="$emit('update:dialog', false)">
            סגירה
          </v-btn>
          <v-btn color="green darken-1" text @click="logOutFunction()">
            התנתק
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    dialog: Boolean,
  },
  methods: {
    ...mapActions(['logout']),
    logOutFunction() {
      this.$emit('update:dialog', false);
      this.logout();
    },
  },
};
</script>

<style></style>
