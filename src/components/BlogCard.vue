<template>
  <div class="blog-card">
      <div class=icons v-show="editPost">
        <div class="icon" @click="editBlog">
        <Edit class="edit"/>
      </div>
      <div class="icon" @click="deletePost">
        <Delete class="delete"/>
      </div>
      </div>
      <img :src="post.blogCoverPhoto" alt=""/>
      <div class="info">
        <h4>{{post.blogTitle}}</h4>
        <h6>Posted on:{{new Date(post.blogDate).toLocaleString("en-us",{dateStyle:"long"})}}</h6>
        <router-link class="link" :to="{ name: 'ViewBlog', params: { blogid: post.blogID } }">View The Post <Arrow class="arrow"/></router-link>
      </div>
    </div>
</template>

<script>
import Arrow from '@/assets/Icons/arrow-right-light.svg'
import Edit from '@/assets/Icons/edit-regular.svg'
import Delete from '@/assets/Icons/trash-regular.svg'
import { mapState } from "vuex";
export default {
  name:"BlogCard",
  props:["post"],
  components:{
    Arrow,
    Edit,
    Delete
  },
  computed:{
    ...mapState(['editPost'])
  },
  methods: {
    deletePost() {
      this.$store.dispatch("deletePost", this.post.blogID);
    },
    editBlog() {
      this.$router.push({ name: "EditBlog", params: { blogid: this.post.blogID } });
    },
  },
}
</script>

<style lang="scss" scoped>
.blog-card {
  position: relative;
  //pointer鼠标变成一个小手
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  min-height: 420px;
  transition: 0.5s ease all;
  &:hover {
    //transform只能转换由盒模型定位的元素
    transform: rotateZ(-1deg) scale(1.01);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .icons {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: #fff;
      transition: 0.5s ease all;
      &:hover {
        background-color: #303030;
        .edit,
        .delete {
          path {
            //改变SVG颜色
            fill: #fff;
          }
        }
      }
      &:nth-child(1) {
        //修改的是edit这个svg图片
        margin-right: 8px;
      }
      .edit,
      .delete {
        pointer-events: none;
        height: 15px;
        width: auto;
      }
    }
  }
  img {
    display: block;
    border-radius: 8px 8px 0 0;
    z-index: 1;
    width: 100%;
    min-height: 200px;
    //保持原有图片比例但可能被剪切
    object-fit: cover;
  }
  .info {
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 3;
    padding: 32px 16px;
    color: #000;
    h4 {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
    }
    h6 {
      font-weight: 400;
      font-size: 12px;
      padding-bottom: 16px;
    }
    .link {
      //inline-flex：将对象作为内联块级弹性伸缩盒显示
      display: inline-flex;
      align-items: center;
      margin-top: auto;
      font-weight: 500;
      padding-top: 20px;
      font-size: 12px;
      padding-bottom: 4px;
      //linear匀速，ease-in先慢后快
      transition: 0.5s ease-in all;
      &:hover {
        color: rgba(48, 48, 48, 0.8);
      }
      .arrow {
        width: 10px;
      }
    }
  }
}
</style>