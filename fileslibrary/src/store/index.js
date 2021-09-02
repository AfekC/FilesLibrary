import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

import usersAPI from "../API/usersAPI.js"
import { smiley_b64 } from "../assets/defaultIcon";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPageName: "",
    user: {},
    token: localStorage.getItem('token') || '',
    status: '',
    parentsDirs: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user || {};
    },
    setCurrentPageName(state, pageName) {
      state.currentPageName = pageName;
    },
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.user = {};
      state.status = ''
      state.token = ''
    },
    setParentsDirsIds(state, parents) {
      state.parentsDirs = parents;
    },
    addToParentsDirsIds(state, folder) {
      if (!state.parentsDirs.some((d) => d.id === folder.id)) {
        state.parentsDirs.push(folder);
      }
    },
    rollBackParentDirsIds(state) {
      state.parentsDirs.pop();
    },
  },
  getters: {
    isUserEmpty: state => Object.keys(state.user).length === 0,
    getUserName: state => state.user.userName || "visitor",
    getUserImage: state => state.user.image || smiley_b64,
    getUserFullName: state => `${state.user.firstName || ''} ${state.user.lastName || ''}`,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getUserId: (state, getters) => getters.isLoggedIn ? state.user.id : null,
    getCurrentDirectoryId: state => state.parentsDirs.length > 0 ? state.parentsDirs[state.parentsDirs.length - 1].id : -1,
  },
  actions: {
    async login({ commit }, formData) {
      commit('auth_request')
      const isSeccessful = await usersAPI.login(formData, (res) => {
        const token = res.data.accessToken
        const user = res.data.user
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Access-Token'] = token
        commit('auth_success', { token, user })
      });
      if (isSeccessful) {
        Swal.fire("Success", "you logded in", "success");
        return true;
      } else {
        commit('auth_error')
        localStorage.removeItem('token')
        Swal.fire("Error", "wrong input", "error");
        return false;
      }
    },
    async signin({ commit }, formData) {
      commit('auth_request')
      const isSeccessful = await usersAPI.signin(formData, (res) => {
        const token = res.data.accessToken
        const user = res.data.user
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Access-Token'] = token
        commit('auth_success', { token, user })
      });
      if (isSeccessful) {
        Swal.fire("Success", "you signed in", "success");
        return true;
      } else {
        commit('auth_error')
        localStorage.removeItem('token')
        Swal.fire("Error", "wrong input", "error");
        return false;
      }
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    rollDirToId({ state, commit, getters }, id) {
      if (!state.parentsDirs.some((dir) => dir.id === id)) {return}
      while (getters.getCurrentDirectoryId != id) {
        commit('rollBackParentDirsIds');
      }
    },
  },
});
