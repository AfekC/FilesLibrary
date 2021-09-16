<template>
  <v-dialog v-model="dialog" persistent width="40vw" style="height: 50vh">
    <v-card justify="center">
      <v-card-title class="justify-center">
        <span class="text-h5">change permissions</span>
      </v-card-title>
      <v-checkbox v-if="isLoggedIn" v-model="isPublic" label="public" class="pl-13" />
      <v-col cols="11" class="pl-13">
        <v-combobox
            v-if="!isPublic"
            v-model="selectedUsers"
            :items="userNames"
            label="Users to share with"
            multiple
            chips
        ></v-combobox>
      </v-col>
      <v-card-actions class="justify-center">
        <v-btn
            color="blue darken-1"
            text
            @click.stop="$emit('update:dialog', false)"
        >
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click.stop="sendChangesToServer()">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import itemsAPI from "../../API/itemsAPI";
import Swal from "sweetalert2";

export default {
  name: "ChangePermission",
  data() {
    return {
      isPublic: true,
      selectedUsers: [],
    };
  },
  props: {
    id: Number,
    isOriginPublic: Boolean,
    dialog: Boolean,
    users: Array,
  },
  async mounted() {
    this.isPublic = this.isOriginPublic;
    const originalUsers = await itemsAPI.getItemUsers(this.id);
    const self = this;
    originalUsers.forEach((userId) => {
      if (userId !== self.getUserId) {
        const user = self.users.find(user => user.id === userId);
        self.selectedUsers.push(user.userName);
      }
    });
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId']),
    userNames() {
      return this.users.map(user => user.userName);
    },
  },
  methods: {
    async sendChangesToServer() {
      const data = {
        itemId: this.id,
        isPublic: this.isPublic,
        usersToShare: this.selectedUsers.map((userName) => {
          return this.users.find(user => user.userName === userName).id;
        }),
      };
      const isSuccessful = await itemsAPI.changeItemAccess(data);
      if (isSuccessful) {
        Swal.fire("Success", "access has changed successfully", "success");
        this.$emit('update');
      } else {
        Swal.fire("Error", "error changing access", "error");
      }
      this.$emit("update:dialog", false);
    },
  },
}
</script>

<style scoped>

</style>