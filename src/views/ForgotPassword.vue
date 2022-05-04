<template>
  <div class="reset-password">
    <Loading v-if="loading" />
    <Modal v-if="modalActive" @close-modal="closeModal" :modalMessage="modalMessage"/>
    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          Back to
          <router-link class="router-link" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
        <h2>Reset Password</h2>
        <p>Forgot your passowrd? Enter your email to reset it</p>
        <div class="inputs">
          <div class="input">
            <input type="text" placeholder="Email" v-model="email" />
            <email class="icon" />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>
<script>
import email from "../assets/Icons/envelope-regular.svg";
import Modal from "@/components/Modal.vue";
import Loading from "@/components/Loading.vue";
import firebase from "firebase/app";
import "firebase/auth";
export default {
  name: "ForgotPassword",
  components: { email, Modal, Loading },
  data() {
    return {
      email: null,
      modalActive: false,
      modalMessage: "",
      loading: null,
    };
  },
  methods: {
    resetPassword(){
      this.loading = true;
      firebase.auth()
      .sendPasswordResetEmail(this.email)
      .then(()=>{
        this.loading = false
        this.modalActive = true
        this.modalMessage = "If your account exists,you will receive an email"
      })
      .catch((err)=>{
        this.loading = false
        this.modalActive = true
        this.modalMessage = err.message
      })
    },
    closeModal() {
      this.modalActive = !this.modalActive;
      this.email = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>