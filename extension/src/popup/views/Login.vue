<template>
  <div class="login-container">
    <form method="post" @submit="login">
      <JInput
        placeholder="Username"
        idFor="username"
        type="text"
        label="👤"
        :required="true"
        :disabled="formDisabled"
        v-model="admin.username"
      />

      <JInput
        placeholder="Password"
        idFor="password"
        type="password"
        label="🔒"
        :required="true"
        :disabled="formDisabled"
        v-model="admin.password"
      />

      <JButton :disabled="formDisabled" style="margin-top: 8px" theme="danger" text="Login 🚀" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

import JInput from "../components/input";
import JButton from "../components/button";

export default {
  name: "Login",

  components: {
    JInput,
    JButton
  },

  data() {
    return {
      formDisabled: false,

      admin: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    async login(e) {
      e.preventDefault();

      this.$store.commit("indicator/set", {
        text: "Logging in",
        theme: "pending"
      });

      this.formDisabled = true;

      const response = await axios.post(
        `${this.HOST_URL}/auth/admin`,
        this.admin
      );

      if (response.status === 200 && response.data.status) {
        const { jwt } = response.data;

        window.localStorage.setItem("jwt", jwt);

        this.$store.commit("indicator/set", {
          text: "Logged in 🎉",
          theme: "info"
        });

        setTimeout(() => {
          this.$router.replace({
            name: "index"
          });
        }, 2000);

        return;
      }

      this.$store.commit("indicator/set", {
        text: "Incorrect ❌",
        theme: "danger"
      });

      setTimeout(() => {
        this.$store.commit("indicator/set", {
          text: "Login required 👮‍♂️",
          theme: "danger"
        });

        this.formDisabled = false;
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/style.scss";

.login-container {
  display: flex;
  margin-top: 25px;
  width: 100%;

  form {
    width: 100%;
  }
}
</style>