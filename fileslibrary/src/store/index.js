import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

import usersAPI from "../API/usersAPI.js"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentPageName: "",
    user: {},
    token: localStorage.getItem('token') || '',
    status: '',
    libraryDirPath: '',
    currDirId: -1,
    parentsDirsIds: [],
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
    setLibraryDirPath(state, path) {
      state.libraryDirPath = path;
    },
    addToLibraryDirPath(state, path) {
      state.libraryDirPath = `${state.libraryDirPath}${path}\\`;
    },
    RollBackLibraryDirPath(state) {
      const splitPath = state.libraryDirPath.split('\\');
      splitPath.pop()
      state.libraryDirPath = splitPath.join('\\');
    },
    setCurrDirId(state, id) {
      state.currDirId = id;
    },
    setParentsDirsIds(state, parentsIds) {
      state.parentsDirsIds = parentsIds;
    },
    addToParentsDirsIds(state, id) {
      state.parentsDirsIds.push(id);;
    },
    rollBackParentDirsIds(state) {
      state.parentsDirsIds.pop();
    },
  },
  getters: {
    isUserEmpty: state => Object.keys(state.user).length === 0,
    getUserName: state => state.user.userName || "visitor",
    getUserImage: state => state.user.image || '@/assets/smiley.png',
    getUserFullName: state => `${state.user.firstName || ''} ${state.user.lastName || ''}`,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getUserId(state, getters) {
      if (getters.isLoggedIn) {
        return state.user.id;
      }
      return;
    }
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
    enterFolder({ state, commit }, item) {
      commit('addToParentsDirsIds', state.currDirId);
      commit('setCurrDirId', item.id)
      commit('addToLibraryDirPath', item.name);
    },
  },
});
