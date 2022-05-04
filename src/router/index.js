import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Blogs from "../views/Blogs.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Profile from "../views/Profile.vue";
import Admin from "../views/Admin.vue";
import CreatePost from "../views/CreatePost";
import BlogPreview from "../views/BlogPreview";
import ViewBlog from "../views/ViewBlog";
import EditBlog from "../views/EditBlog";
import firebase from "firebase/app";
import "firebase/auth";
Vue.use(VueRouter);

//先把VueRouter原型对象的push|replace保存一份
let originalPush = VueRouter.prototype.push
let originalReplace = VueRouter.prototype.replace

//重写push和replace
//因为push或者replace返回的是一个promise,所以要传入相应的成功和失败的回调
//this.$router属性是VueRouter类的一个实例，是注册路由的时候给组件实例添加的
//push也是VueRouter的一个实例（？）
//第一个参数：push跳转位置.第二个参数是成功的回调。第三个参数是失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
	if (resolve && reject) {
		//函数对象的apply与call的区别?
		//相同点:都可以改变函数的上下文一次，而且函数会立即执行一次
		//不同：函数执行的时候，传递参数不同，apply需要的是数组，call传递参数的时候用逗号隔开
		//原始的push方法可以进行路由跳转，但是需要保证上下文this是VueRouter类的实例
		//第一种情况：外部在使用push的时候传递成功与失败的回调
		//函数(也就是原型对象push)的上下文是VueRouter的一个实例(this.$router)所以用call
		//this.$router.push()
		originalPush.call(this, location, resolve, reject);
	} else {
		//第二种情况：外部在使用push方法的时候没有传递成功与失败的回调函数
		originalPush.call(this, location, () => { }, () => { });
	}
}

VueRouter.prototype.replace = function (location, resolve, reject) {
	if (resolve && reject) {
		originalReplace.call(this, location, resolve, reject);
	} else {
		originalReplace.call(this, location, () => { }, () => { });
	}
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta:{title:'Home',showNav:true,showFooter:true,isAuth:true}
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
    meta:{title:'Blogs',showNav:true,showFooter:true,isAuth:true}
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta:{title:'Login',showNav:false,showFooter:false,isAuth:true}
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta:{title:'Register',showNav:false,showFooter:false,isAuth:true}
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta:{title:'Forgot Password',showNav:false,showFooter:false,isAuth:true}
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta:{title:'Profile',showNav:true,showFooter:false,isAuth:false}
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta:{title:'Admin',showNav:true,showFooter:true,isAuth:false}
  },
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
    meta:{title:'Create Post',showNav:true,showFooter:false,isAuth:false}
  },
  {
    path: "/post-preview",
    name: "BlogPreview",
    component: BlogPreview,
    meta:{title:'Preview Blog Post',showNav:true,showFooter:false,isAuth:false}
  },
  {
    path: "/view-blog/:blogid",
    name: "ViewBlog",
    component: ViewBlog,
    meta:{title:'View Blog',showNav:true,showFooter:false,isAuth:true}
  },
  {
    path: "/edit-blog/:blogid",
    name: "EditBlog",
    component: EditBlog,
    meta:{title:'Edit Blog',showNav:true,showFooter:false,isAuth:false}
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
router.beforeEach((to,from,next)=>{
	//console.log('前置路由守卫',to,from,next)
  //document.title = to.meta.title
  if(firebase.auth().currentUser){
    //用户登录上就不让再去login了
    if(to.path=='/login'){
      next('/')
    }else{
      next()
    }
  }else{
    //用户未登录上
    if(to.meta.isAuth){
      next()
    }else{
      next('/')
    }
  }
})

//因为已经配置路径"/"为home所以标签写路由前值也可以
//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to,from)=>{
	console.log('后置路由守卫',to,from)
	document.title = to.meta.title
})

export default router;
