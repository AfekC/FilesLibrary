<template>
  <v-dialog v-model="dialog" persistent width="37vw" style="height: 50vh">
    <v-card :loading="loading" justify="center">
      <template slot="progress">
        <v-progress-linear
            :value="uploadPercentage.value"
            color="blue-grey"
            height="3vh"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </template>
      <div v-if="uploadPercentage.value !== 100">
        <v-card-title class="justify-center">
          <span class="text-h5">בחר קבצים</span>
        </v-card-title>
        <v-checkbox v-if="isLoggedIn" v-model="isPublic" label="public" class="pl-13" />
        <v-col cols="11" class="pl-13">
          <v-combobox
              v-if="!isPublic"
              v-model="selectedUsers"
              :items="userNames"
              label="משתמשים לבחירה"
              multiple
              chips
          ></v-combobox>
        </v-col>
        <v-file-input
          v-model="files"
          width="30vw"
          color="deep-purple accent-4"
          counter
          label="File input"
          multiple
          prepend-icon="mdi-paperclip"
          outlined
          show-size
          style="width: 30vw"
          class="ma-2 ml-11"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip
              v-if="index < 2"
              color="deep-purple accent-4"
              dark
              label
              small
            >
              {{ text }}
            </v-chip>

            <span
              v-else-if="index === 2"
              class="text-overline grey--text text--darken-3 mx-2"
            >
              +{{ files.length - 2 }} File(s)
            </span>
          </template>
        </v-file-input>
        <v-card-actions class="justify-center">
          <v-btn
            color="blue darken-1"
            text
            :disabled="loading"
            @click.stop="$emit('update:dialog', false)"
          >
            סגירה
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              :disabled="loading || files.length === 0"
              @click.stop="uploadFiles">
            אישור
          </v-btn>
        </v-card-actions>
      </div>
      <div v-else>
        <v-card-title class="justify-center">
          <span class="text-h5">מחכה לאישור ההעלאה מהשרת</span>
        </v-card-title>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import itemsAPI from "../../API/itemsAPI.js";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isPublic: true,
      files: [],
      loading: false,
      selectedUsers: [],
      uploadPercentage: { value: 0 },
    };
  },
  props: {
    dialog: Boolean,
    users: Array,
  },
  methods: {
    async uploadFiles() {
      if (this.files) {
        this.uploadPercentage.value = 0;
        this.loading = true;
        let formData = new FormData();

        // files
        for (let file of this.files) {
          formData.append("files", file, file.name);
        }

        // additional data
        formData.append("isPublic", this.isPublic);
        formData.append("creator", this.getUserId);
        formData.append("parentItem", this.getCurrentDirectoryId === -1 ? null : this.getCurrentDirectoryId);

        formData.append("usersToShare", JSON.stringify(this.selectedUsers.map((userName) => {
          return this.users.find(user => user.userName === userName).id;
        })));

        const isSuccess = await itemsAPI.uploadFiles(formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadPercentage.value = percentCompleted;
          }
        });
        if (isSuccess) {
          Swal.fire("Success", "כל הקבצים הועלו בהצלחה", "success");
          this.$emit('update');
        } else {
          Swal.fire("Error", "שגיאה בהעלעת הקבצים", "error");
        }
        this.loading = false;
        this.$emit("update:dialog", false);
      } else {
        console.log("there are no files.");
      }
    },
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserId', 'getCurrentDirectoryId']),
    userNames() {
        return this.users.map(user => user.userName);
    },
  },
};
</script>

<style></style>
