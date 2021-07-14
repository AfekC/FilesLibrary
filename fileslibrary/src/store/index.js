import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPageName: "",
    user: {
      firstName: "Afek",
      lastName: "Cohen",
      userName: "AfekC",
      image: null,
      files: ['1.txt', '3.txt', '2.txt'],
      folders: ['dir1', 'dir2'],
    },
  },
  mutations: {
    setCurrentPageName(state, pageName) {
      state.currentPageName = pageName;
    },
    setCurrentUser(state, user) {
      state.user = user;
    },
  },
  getters: {
    getUserName(state) {
      return state.user.userName || "visitor";
    },
    isSignIn(state) {
      return Object.keys(state.user).length !== 0;
    },
    getUserImage(state) {
      return state.user.image || '@/assets/smiley.png';
    },
    getUserFullName(state) {
      return `${state.user.firstName} ${state.user.lastName}`;
    },
  },
  actions: {
    logout({ commit }) {
      commit("setCurrentUser", {});
    },
  },
});
