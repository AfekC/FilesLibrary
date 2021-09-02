<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-form v-model="isValidate">
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
              :disabled="!isValidate"
              color="blue darken-1"
              text
              @click.stop="saveUser()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import rules from "../../consts/rules.js";

export default {
  data() {
    return {
      isValidate: true,
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      nameRules: rules.nameRules,
      userNameRules: rules.userNameRules,
      passwordRules: rules.passwordRules,
    };
  },
  props: {
    dialog: Boolean,
  },
  methods: {
    ...mapActions(["signin"]),
    saveUser() {
      if (this.isValidate) {
        const formData = {
          userName: this.userName,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
        };
        if (this.signin(formData)) {
          this.$emit("update:dialog", false);
        }
      }
    },
  },
};
</script>

<style></style>
