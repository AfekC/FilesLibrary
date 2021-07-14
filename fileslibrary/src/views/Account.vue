<template>
  <v-container v-if="!isSignIn">
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
    <v-row>
      <v-card width="100%" height="8vh">
        <v-row>
          <v-col cols="8" class="ma-0 pt-2 pl-10 mr-10">
            <v-card-title>
              <v-text-field
                v-model="search"
                dense
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
          </v-col>
          <v-col cols="3">
            <v-btn color="blue-grey" class="ma-2 white--text" width="100%">
              Upload
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row class="pt-5">
      <v-card width="100%">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
        ></v-data-table>
      </v-card>
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
        { text: "Fat (g)", filterable: true, value: "fat" },
        { text: "Carbs (g)", filterable: true, value: "carbs" },
        { text: "Protein (g)", filterable: true, value: "protein" },
        { text: "Iron (%)", filterable: true, value: "iron" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%",
        },
      ],
    };
  },
  components: { SignIn, LogIn },
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.ACCOUNT_PAGE);
  },
  computed: {
    ...mapGetters(["isSignIn", "getUserImage", "getUserFullName"]),
  },
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
};
</script>
