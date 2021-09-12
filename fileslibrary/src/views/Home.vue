<template>
  <v-container>
    <v-row class="text-center" style="padding-top: 15vh">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to The Shared Library
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import consts from "../consts";

export default {
  name: 'Home',
  methods: {
    ...mapMutations(['setCurrentPageName']),
  },
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.HOME_PAGE);
  },
};
</script>
