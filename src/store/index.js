import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase/app";
import "firebase/auth";
import db from '@/firebase/firebaseInit'

Vue.use(Vuex)


const state = {
  blogPosts: [],
  postLoaded: null,
  blogHTML: "Write your blog title here...",
  blogTitle: "",
  blogPhotoName: "",
  blogPhotoFileURL: null,
  blogPhotoPreview: null,
  editPost: null,
  user: false,
  profileAdmin: null,
  profileEmail: null,
  profileFirstName: null,
  profileLastName: null,
  profileUserName: null,
  profileId: null,
  profileInitials: null,
}
const mutations = {
  newBlogPost(state, payload) {
    state.blogHTML = payload;
    console.log(state.blogHTML)
  },
  updateBlogTitle(state, payload) {
    state.blogTitle = payload;
  },
  fileNameChange(state, payload) {
    state.blogPhotoName = payload;
  },
  createFileURL(state, payload) {
    state.blogPhotoFileURL = payload;
  },
  changePhotoPreview(state) {
    state.blogPhotoPreview = !state.blogPhotoPreview;
  },
  //value是布尔值
  toggleEditPost(state, value) {
    state.editPost = value
    //console.log(state.editPost)
  },
  setProfileInfo(state, doc) {
    state.profileId = doc.id;
    state.profileEmail = doc.data().email;
    state.profileFirstName = doc.data().firstName;
    state.profileLastName = doc.data().lastName;
    state.profileUserName = doc.data().userName;
    //console.log(state.profileUserName);
  },
  setProfileInitials(state) {
    // /g，global全局匹配，match方法，则一次返回所有的匹配
    // /S匹配任何非空白字符，不包括换行。
    state.profileInitials =
      state.profileFirstName.match(/(\b\S)?/g).join("") + state.profileLastName.match(/(\b\S)?/g).join("");
    //console.log(state.profileInitials);
  },
  //user是布尔值
  updateUser(state, payload) {
    state.user = payload
  },
  changeFirstName(state, payload) {
    state.profileFirstName = payload;
  },
  changeLastName(state, payload) {
    state.profileLastName = payload;
  },
  changeUserName(state, payload) {
    state.profileUserName = payload;
  },
  filterBlogPost(state, payload) {
    state.blogPosts = state.blogPosts.filter((post) => post.blogID !== payload);
  },
  setBlogState(state, payload) {
    state.blogTitle = payload.blogTitle;
    state.blogHTML = payload.blogHTML;
    state.blogPhotoFileURL = payload.blogCoverPhoto;
    state.blogPhotoName = payload.blogCoverPhotoName;
  },
}
const actions = {
  async getCurrentUser({ commit }) {
    const dataBase = await db.collection("users").doc(firebase.auth().currentUser.uid);
    const dbResults = await dataBase.get();
    commit("setProfileInfo", dbResults);
    commit("setProfileInitials");
    //const token = await user.getIdTokenResult();
    //const admin = await token.claims.admin;
    //commit("setProfileAdmin", admin);
  },
  async updateUserSettings({ commit, state }) {
    const dataBase = await db.collection("users").doc(state.profileId);
    await dataBase.update({
      firstName: state.profileFirstName,
      lastName: state.profileLastName,
      userName: state.profileUserName,
    });
    commit("setProfileInitials");
  },
  async getPost({ state }) {
    const dataBase = await db.collection("blogPosts").orderBy("date", "desc");
    const dbResults = await dataBase.get();
    dbResults.forEach((doc) => {
      if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
        const data = {
          blogID: doc.data().blogID,
          blogHTML: doc.data().blogHTML,
          blogCoverPhoto: doc.data().blogCoverPhoto,
          blogTitle: doc.data().blogTitle,
          blogDate: doc.data().date,
          blogCoverPhotoName: doc.data().blogCoverPhotoName,
        };
        state.blogPosts.push(data);
      }
    });
    state.postLoaded = true;
    //console.log(state.blogPosts)
  },
  async deletePost({ commit }, payload) {
    const getPost = await db.collection("blogPosts").doc(payload);
    await getPost.delete();
    commit("filterBlogPost", payload);
  },
  async updatePost({ commit, dispatch }, payload) {
    commit("filterBlogPost", payload);
    await dispatch("getPost");
  },
}

const getters = {
  blogPostsFeed(state) {
    return state.blogPosts.slice(0, 2);
  },
  blogPostsCards(state) {
    return state.blogPosts.slice(2, 6);
  },
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
