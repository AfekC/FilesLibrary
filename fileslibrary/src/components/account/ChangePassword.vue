<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-form v-model="isValidate">
        <v-card-title style="justify-content: end">
          <span class="text-h5">שנה סיסמה</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="oldPassword"
                    label="סיסמה נוכחית"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    :rules="passwordRules"
                    v-model="newPassword"
                    label="סיסמה חדשה"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="newPasswordConfirm"
                    label="חזרה על סיסמה חדשה"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*שדות חובה</small>
          <br/>
          <small>וודא שהסיסמאות זהות</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click.stop="$emit('update:dialog', false)"
          >
            סגירה
          </v-btn>
          <v-btn
              :disabled="!isValidate || newPassword !== newPasswordConfirm"
              color="blue darken-1"
              text
              @click.stop="savePassword()"
          >
            שמור
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
        Swal.fire("Success", "הסיסמה החדשה עודכנה בהצלחה", "success");
      } else {
        console.log(response)
        if (response === 401) {
          Swal.fire("Error", "סיסמה שגויה", "error");
        } else {
          Swal.fire("Error", "שגיאה בתהליך עדכון הסיסמה", "error");
        }
      }
    },
  },
}
</script>

<style scoped>

</style>