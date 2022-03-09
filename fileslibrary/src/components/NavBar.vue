<template>
  <div>
    <v-app-bar color="primary" dense maxHeight="7vh">
      <v-app-bar-nav-icon @click="drawer = true" />

      <v-toolbar-title>{{ currentPageName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title>
        <v-text-field>{{ getUserName }}</v-text-field>
        <v-text-field>  :שלום</v-text-field>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> תפריט </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item v-for="item in list" :key="item.title" :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-if="isLoggedIn" v-slot:append>
        <div class="pa-2 pb-8">
          <v-btn @click.stop="logOutDialog = true" block> התנתק </v-btn>
          <LogOut :dialog.sync="logOutDialog"/>
        </div>
      </template>
      <template v-else v-slot:append>
        <div class="pa-2 pb-8">
          <v-btn @click.stop="logInDialog = true" block> התחבר </v-btn>
          <v-btn @click.stop="signInDialog = true" block class="mt-2"> הרשם </v-btn>
          <LogIn :dialog.sync="logInDialog"/>
          <SignIn :dialog.sync="signInDialog"/>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import LogIn from "./account/LogIn.vue";
import SignIn from "./account/SignIn.vue";
import LogOut from "./account/LogOut";

export default {
  name: "NavBar",
  components: {
    LogOut,
    LogIn,
    SignIn,
  },
  data() {
    return {
      drawer: false,
      logOutDialog: false,
      logInDialog: false,
      signInDialog: false,
      list: [
        {
          icon: "mdi-home",
          title: "מסך הבית",
          link: "/",
        },
        {
          icon: "mdi-book",
          title: "תיקייה משותפת",
          link: "/library",
        },
        {
          icon: "mdi-account",
          title: "פרטי משתמש",
          link: "/account",
        },
      ],
    };
  },
  computed: {
    ...mapState(['currentPageName']),
    ...mapGetters(['getUserName', 'isLoggedIn']),
  },
};
</script>

<style></style>
