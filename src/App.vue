<template>
  <div class="app-wrapper">
    <!-- postLoaded解决ViewBlog粘贴网址报错-->
    <!-- 因为postLoaded在getPost为true说明这时候已经有数据了 -->
    <div class="app" v-if="postLoaded">
      <Navigation v-show="$route.meta.showNav" />
      <router-view />
      <Footer v-show="$route.meta.showFooter" />
    </div>
  </div>
  
</template>

<script>
import Navigation from "./components/Navigation.vue"
import Footer from "./components/Footer.vue"
import firebase from "firebase/app";
import "firebase/auth";
import { mapState } from 'vuex';
export default {
  name: "app",
  components: {
    Navigation,
    Footer
  },
  data() {
    return {};
  },
  computed:{
    ...mapState(['postLoaded'])
  },
  mounted() {
    this.$store.dispatch('getPost')
    //console.log(firebase.auth().currentUser)
  },
  created() {
    //app初始化在firebase之前，所以下面这行是null
    //所以要在main更改初始化顺序
    //console.log(firebase.auth().currentUser)
    firebase.auth().onAuthStateChanged(async(user) => {
      this.$store.commit("updateUser", user);
      if (user) {
        await this.$store.dispatch("getCurrentUser");
        //记录bug这里没写async await的话下面这行仍为初始值
        //console.log(this.$store.state.profileEmail)
      }
    });
  },
  methods: {},
  watch: {},
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}

.arrow {
  margin-left: 8px;
  width: 12px;
  path {
    fill: #000;
  }
}
.arrow-light {
  path {
    fill: #fff;
  }
}

button,
.router-button {
  transition: 500ms ease all;
  cursor: pointer;
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #303030;
  color: #fff;
  //给元素添加一个圆角边框
  border-radius: 20px;
  border: none;
  text-transform: uppercase;
  &:focus {
    //outline设置边框 样式
    outline: none;
  }
  &:hover {
    background-color: rgba(48, 48, 48, 0.7);
  }
}
.button-ghost {
  color: #000;
  padding: 0;
  border-radius: 0;
  margin-top: 50px;
  font-size: 15px;
  font-weight: 500;
  background-color: transparent;
  @media (min-width: 700px) {
    margin-top: 0;
    margin-left: auto;
  }
  i {
    margin-left: 8px;
  }
}
.button-light {
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
}
.button-inactive {
  pointer-events: none !important;
  cursor: none !important;
  background-color: rgba(128, 128, 128, 0.5) !important;
}
.error {
  text-align: center;
  font-size: 12px;
  color: red;
}
.blog-card-wrap {
  position: relative;
  padding: 80px 16px;
  background-color: #f1f1f1;
  @media (min-width: 500px) {
    padding: 100px 16px;
  }
  .blog-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;
    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
