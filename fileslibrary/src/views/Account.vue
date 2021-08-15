<template>
  <v-container v-if="!isLoggedIn">
    <v-row class="text-center">
      <v-col class="text-center" style="padding-top: 25vh">
        <h1 class="display-2 font-weight-bold">You Are Not Signed In</h1>
        <div style="padding-top: 5vh">
          <v-btn @click.stop="logInDialog = true" class="ma-5"> LOG IN </v-btn>
          <v-btn @click.stop="signInDialog = true" class="ma-5">
            SIGN IN
          </v-btn>
          <LogIn :dialog.sync="logInDialog" />
          <SignIn :dialog.sync="signInDialog" />
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row class="text-center mt-7">
      <v-img src="@/assets/smiley.png" contain height="100" weight="100" />
    </v-row>
    <v-row justify="center" class="mt-5 mb-3">
      <h5 style="font-size: 1.5em">{{ `hello, ${getUserFullName}` }}</h5>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import consts from "../consts";
import SignIn from "../components/SingIn.vue";
import LogIn from "../components/LogIn.vue";

export default {
  name: "Account",
  data() {
    return {
      signInDialog: false,
      logInDialog: false,
      search: "",
      headers: [
        {
          text: "file\\directory",
          align: "start",
          filterable: true,
          value: "name",
        },
        { text: "uploaded date", filterable: true, value: "time" },
        { text: "attenders", value: "attenders" },
        { text: "size (kb)", filterable: true, value: "size" },
      ],
      desserts: [
        {
          name: "a.txt",
          time: Date.now().toString(),
          attenders: ["Elia", "Noam"],
          size: 24,
        },
        {
          name: "folder 1",
          time: Date.now().toString(),
          attenders: [],
          size: 1024,
        },
      ],
    };
  },
  components: { SignIn, LogIn },
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.ACCOUNT_PAGE);
  },
  computed: {
    ...mapGetters(["isLoggedIn", "getUserImage", "getUserFullName"]),
  },
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
};
</script>
