<template>
  <div>
    <v-app-bar color="primary" dense maxHeight="7vh">
      <v-app-bar-nav-icon @click="drawer = true" />

      <v-toolbar-title>{{ currentPageName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title>{{ getUserName }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Menu </v-list-item-title>
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
        <div class="pa-2">
          <v-btn @click.stop="dialog = true" block> Logout </v-btn>
          <v-dialog v-model="dialog" max-width="290">
            <v-card>
              <v-card-title>
                Are You Sure You Want To Log Out?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="logOutFunction()">
                  LogOut
                </v-btn>
                <v-btn color="green darken-1" text @click="dialog = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      drawer: false,
      dialog: false,
      list: [
        {
          icon: "mdi-home",
          title: "Home",
          link: "/",
        },
        {
          icon: "mdi-book",
          title: "Library",
          link: "/library",
        },
        {
          icon: "mdi-account",
          title: "Account",
          link: "/account",
        },
      ],
    };
  },
  computed: {
    ...mapState(["currentPageName"]),
    ...mapGetters(["getUserName", "isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
    logOutFunction() {
      this.dialog = false;
      this.logout();
    },
  },
};
</script>

<style></style>
