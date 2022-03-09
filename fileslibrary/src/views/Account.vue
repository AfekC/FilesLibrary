<template>
  <v-container v-if="!isLoggedIn">
    <v-row class="text-center">
      <v-col class="text-center" style="padding-top: 25vh">
        <h1 class="display-2 font-weight-bold">התחבר כמשתמש על מנת לערוך פרטים אישיים</h1>
        <div style="padding-top: 5vh">
          <v-btn @click.stop="logInDialog = true" class="ma-5"> התחבר</v-btn>
          <v-btn @click.stop="signInDialog = true" class="ma-5">הרשם</v-btn>
          <LogIn :dialog.sync="logInDialog"/>
          <SignIn :dialog.sync="signInDialog"/>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else class="mt-13">
    <v-row justify="center">
      <v-col cols="4" md="2">
        <div style="position:relative">
          <v-img :src="getUserImage"
               contain
               height="15vh"
               weight="100%"
               style="border-radius: 50%"/>
          <v-btn elevation="5"
               fab
               small
               plain
               style="position:absolute; bottom:-1vh; left:8.5vw; background-color: white"
               @click.stop="uploadImageDialog = true">
            <v-icon >mdi mdi-pencil</v-icon>
            <UploadImage :dialog.sync="uploadImageDialog"/>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-10">
      <v-col cols="10" md="4">
        <UpdateUser />
      </v-col>
    </v-row>
    <v-row justify="center" class="pa-3">
      <a @click.stop="changePasswordDialog = true"> שנה סיסמה </a>
      <ChangePassword :dialog.sync="changePasswordDialog" />
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import consts from "../consts";
import SignIn from "../components/account/SignIn.vue";
import LogIn from "../components/account/LogIn.vue";
import UpdateUser from "../components/account/UpdateUser";
import ChangePassword from "../components/account/ChangePassword";
import UploadImage from "../components/account/UploadImage";

export default {
  name: "Account",
  data() {
    return {
      signInDialog: false,
      logInDialog: false,
      changePasswordDialog: false,
      uploadImageDialog: false,
    };
  },
  components: {UploadImage, ChangePassword, UpdateUser, SignIn, LogIn},
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.ACCOUNT_PAGE);
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUserImage']),
  },
  methods: {
    ...mapMutations(['setCurrentPageName']),
  },
};
</script>
