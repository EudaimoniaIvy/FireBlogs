import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//Vue2Editor是一个富文本编辑器
import Vue2Editor from "vue2-editor";

import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Vue2Editor);

Vue.config.productionTip = false;

//让app初始化在firebase初始化之后
let app;
firebase.auth().onAuthStateChanged(()=>{
  if(!app){
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
  
})

