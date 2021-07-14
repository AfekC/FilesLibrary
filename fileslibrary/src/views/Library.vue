<template>
  <p>Library</p>
</template>

<script>
import { mapMutations } from "vuex";
import consts from "../consts";

export default {
  name: "Library",
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
};
</script>