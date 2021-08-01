<template>
  <v-app>
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";
import { mapActions, mapGetters, mapMutations } from "vuex";
import usersAPI from "./API/usersAPI.js";

export default {
  name: "App",
  components: { NavBar },
  methods: {
    ...mapActions(["logout", "logout"]),
    ...mapMutations(["setUser"]),
  },
  computed: {
    ...mapGetters(["isLoggedIn", "isUserEmpty"]),
  },
  async created() {
    if (this.isLoggedIn && this.isUserEmpty) {
      const user = await usersAPI.getUserByToken();
      if (!user) {
        this.logout();
      }
      this.setUser(user || {});
    }
    this.$http.interceptors.response.use(undefined, (err) => {
      return new Promise(() => {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.logout();
        }
        throw err;
      });
    });
  },
};
</script>

<style>
html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>