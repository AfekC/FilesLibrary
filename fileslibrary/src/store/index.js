import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Swal from "sweetalert2";
import fileType from "file-type";

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
    setUserImage(state, image) {
      Vue.set(state.user, "image", image);
    },
    setCurrentPageName(state, pageName) {
      state.currentPageName = pageName;
    },
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
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
    getUserImage: state => {
      return state.user.image || smiley_b64
    },
    getUserFullName: state => `${state.user.firstName || ''} ${state.user.lastName || ''}`,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getUserId: (state, getters) => getters.isLoggedIn ? state.user.id : null,
    getCurrentDirectoryId: state => state.parentsDirs.length > 0 ? state.parentsDirs[state.parentsDirs.length - 1].id : -1,
  },
  actions: {
    async setUser({ commit }, user) {
      if (user.image) {
        let binary = '';
        const bytes = new Uint8Array( user.image.data );
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
        }
        const base64string = window.btoa( binary );

        const { mime } = await fileType.fromBuffer(Buffer.from(base64string, "base64"));

        user.image = `data:${mime};base64,${base64string}`;
      }
      commit('setUser', user);
    },
    authSuccess({commit, dispatch}, { token, user}) {
      dispatch('setUser', user);
      commit('auth_success', token);
    },
    async login({ commit, dispatch }, formData) {
      commit('auth_request')
      const isSeccessful = await usersAPI.login(formData, (res) => {
        const token = res.data.accessToken
        const user = res.data.user
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Access-Token'] = token
        dispatch('authSuccess', { token, user })
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
    async signin({ commit, dispatch }, formData) {
      commit('auth_request')
      const isSeccessful = await usersAPI.signin(formData, (res) => {
        const token = res.data.accessToken
        const user = res.data.user
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Access-Token'] = token
        dispatch('authSuccess', { token, user })
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
        Swal.fire("Success", "you logout", "success");
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
