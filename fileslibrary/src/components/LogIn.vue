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
          <v-btn color="blue darken-1" text @click.stop="logIn"> Log In </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

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
    logIn() {
      const formData = {
        user_name: this.userName,
        password: this.password,
      };
      axios
        .post("http://localhost:4000/users/login", formData)
        .then((response) => {
          if (response.data.data) {
            console.log("Success!");
            console.log({ response });
            Swal.fire("Success", "you logded in", "success");
            this.$emit("update:dialog", false);
          } else {
            Swal.fire("Error", "wrong input", "error");
          }
        })
        .catch((error) => {
          console.log({ error });
        });
    },
  },
};
</script>

<style></style>
