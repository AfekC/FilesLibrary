<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-form v-model="isValidate">
        <v-card-title>
          <span class="text-h5">Change Password</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="oldPassword"
                    label="Current Password"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    :rules="passwordRules"
                    v-model="newPassword"
                    label="New Password"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="newPasswordConfirm"
                    label="Confirm Password"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
          <br/>
          <small>make sure that the passwords are similar</small>
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
              :disabled="!isValidate || newPassword !== newPasswordConfirm"
              color="blue darken-1"
              text
              @click.stop="savePassword()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import rules from '../../consts/rules.js';
import usersAPI from "../../API/usersAPI";
import Swal from "sweetalert2";

export default {
  name: 'ChangePassword',
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      isValidate: false,
      passwordRules: rules.passwordRules,
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    };
  },
  methods: {
    async savePassword() {
      const response = await usersAPI.updatePassword(this.oldPassword, this.newPassword)
      if (response === true) {
        this.$emit('update:dialog', false);
        Swal.fire("Success", "Password Updated Successfully", "success");
      } else {
        console.log(response)
        if (response === 401) {
          Swal.fire("Error", "Wrong Password", "error");
        } else {
          Swal.fire("Error", "Error Update Password", "error");
        }
      }
    },
  },
}
</script>

<style scoped>

</style>