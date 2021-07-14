<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  :rules="nameRules"
                  v-model="firstName"
                  label="first name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :rules="nameRules"
                  v-model="lastName"
                  label="last name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="userNameRules"
                  v-model="userName"
                  label="user name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="passwordRules"
                  v-model="password"
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
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
            color="blue darken-1"
            text
            @click.stop="$emit('update:dialog', false)"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      nameRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
          const pattern = /^[a-zA-Z]+$/;
          return pattern.test(value) || "Invalid name.";
        },
      ],
      userNameRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
          const pattern = /^[a-zA-Z0-9]+$/;
          return pattern.test(value) || "Invalid userName.";
        },
      ],
      passwordRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
          const pattern = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w!@#$%^&*]{6,30}$/;
          return pattern.test(value) || "Invalid password.";
        },
      ],
    };
  },
  props: {
    dialog: Boolean,
  },
};
</script>

<style></style>
