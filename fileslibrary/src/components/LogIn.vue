<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="userName"
                  label="user name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
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
          <v-btn color="blue darken-1" text @click.stop="logIn()">
            Log In
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      userName: "",
      password: "",
    };
  },
  props: {
    dialog: Boolean,
  },
  methods: {
    ...mapActions(["login"]),
    logIn() {
      if (this.login({ userName: this.userName, password: this.password })) {
        this.$emit("update:dialog", false);
      }
    },
  },
};
</script>

<style></style>
