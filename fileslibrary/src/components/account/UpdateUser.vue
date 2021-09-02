<template>
  <v-card style="border-radius: 15px">
    <v-row v-for="field in fields" :key="field.title">
      <v-col cols="3">
        <v-subheader class="ml-1">{{ field.title + ":" }}</v-subheader>
      </v-col>
      <v-col v-if="!field.isEdit"
             cols="6"
             class="ml-3 pt-5">
        <h3>{{ user[field.title] }}</h3>
      </v-col>
      <v-col v-else
             cols="6"
             class="ml-3 mt-2">
        <v-text-field v-model="field.value"
                      dense
                      :rules="rules[field.ruleName]">
        </v-text-field>
      </v-col>
      <v-col cols="2" class="pt-4">
        <v-btn v-if="!field.isEdit"
               elevation="5"
               fab
               small
               plain
               @click="field.isEdit = true">
          <v-icon>mdi mdi-pencil</v-icon>
        </v-btn>
        <v-btn v-else elevation="5"
               fab
               small
               plain
               @click="field.isEdit = false">
          X
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pa-0"></v-col>
      <v-col cols="4">
        <v-btn v-if="isAnyFiledEdited"
               :disabled="!isEditedFieldsAreGood"
               outlined
               color="indigo"
               elevation="1"
               width="100%"
               @click="saveUser()">
          SAVE
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import usersAPI from "../../API/usersAPI";
import Swal from "sweetalert2";
import rules from "../../consts/rules";

export default {
  name: "UpdateUser",
  data() {
    return {
      fields: [{ title: "firstName", isEdit: false, ruleName: "nameRules", value:"" }, { title: "lastName", isEdit: false, ruleName: "nameRules", value:"" }, { title: "userName", isEdit: false, ruleName: "userNameRules", value:"" }],
      rules,
    };
  },
  computed: {
    ...mapState(["user"]),
    isAnyFiledEdited() {
      return this.fields.some((field) => field.isEdit);
    },
    isEditedFieldsAreGood() {
      return this.fields.every((field) => !field.isEdit || this.rules[field.ruleName].every((rule) => rule(field.value) === true));
    },
  },
  methods: {
    ...mapMutations(["setUser"]),
    async saveUser() {
      const updatedFields = {};
      this.fields.forEach((field) => {
        if (field.isEdit) {
          updatedFields[field.title] = field.value;
        }
      });
      const user = await usersAPI.updateUser(updatedFields);
      if (user) {
        this.setUser(user);
        this.fields.forEach((field) => {
          field.value = "";
          field.isEdit = false;
        });
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