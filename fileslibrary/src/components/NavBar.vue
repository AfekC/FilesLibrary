<template>
  <div>
    <v-app-bar color="primary" dense maxHeight="7vh">
      <v-app-bar-nav-icon @click="drawer = true" />

      <v-toolbar-title>{{ currentPageName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
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
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      drawer: false,
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
  },
};
</script>

<style></style>
