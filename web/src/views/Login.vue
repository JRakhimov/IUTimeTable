<template>
  <v-container class="login-container" fluid>
    <v-layout class="main-form" row wrap>
      <div class="form-header">
        <v-icon color="white">account_circle</v-icon>
        <h2>IUTimeTable</h2>
      </div>

      <v-flex class="form-container" xs12>
        <v-form ref="form" v-model="valid">
          <v-layout column>
            <v-flex>
              <v-text-field
                prefix="U"
                prepend-icon="account_circle"
                v-model="formData.studentID"
                :rules="studentIDRules"
                @focus="resetError()"
                :disabled="isOffline || loading"
                label="StudentID"
                name="StudentID"
                :counter="max"
                type="text"
                clearable
                required
              ></v-text-field>
            </v-flex>

            <v-flex>
              <v-text-field
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                :rules="passwordRules"
                @focus="resetError()"
                :disabled="isOffline || loading"
                prepend-icon="lock"
                label="Password"
                name="Password"
                clearable
                required
              ></v-text-field>
            </v-flex>

            <v-flex class="text-xs-center" v-if="error">
              <p class="error-message">{{ message }}</p>
            </v-flex>

            <v-flex class="text-xs-center" mb-3>
              <v-btn
                :color="error ? '#E45164' : '#1976d2'"
                @click.prevent="login()"
                :disabled="!valid && isOffline"
                :loading="loading"
                type="submit"
                large
                flat
              >Login</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { VueOfflineMixin } from "vue-offline";

export default {
  name: "Login",
  mixins: [VueOfflineMixin],

  data() {
    return {
      showPassword: false,
      loading: false,
      valid: false,
      error: false,
      message: "",
      studentIDRules: [
        v => (v || "").length === 7 || `StudentID should containt 7 characters.`
      ],
      passwordRules: [v => !!v || "Password is required"],
      max: 7,
      formData: {
        studentID: "",
        password: ""
      }
    };
  },

  methods: {
    resetError() {
      this.error = false;
    },
    async login() {
      this.error = false;

      let studentID = this.formData.studentID;
      studentID = studentID.split("");
      studentID.unshift("U");
      studentID = studentID.join("");

      this.loading = true;

      const URL = `${this.HOST_URL}/auth/eclass`;

      try {
        const { data } = await axios.post(URL, { ...this.formData, studentID });

        if (data.status) {
          localStorage.setItem("jwt", data.jwt);
          this.$store.commit("setProfile", data.student);

          this.$router.replace({ name: "timetable" });
        } else {
          this.error = true;
          this.message = data.message;
        }
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    }
  }
};
</script>

<style lang="scss">
.login-container {
  background-color: #1d2331;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  margin-top: 120px;
}

.main-form {
  margin: 0 auto;
  max-width: 350px;
  min-width: 350px;
  padding: 0px 20px;
  position: relative;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.5);
}

.form-header {
  width: 310px;
  top: -85px;
  padding: 10px 0;
  background: #1976d2;
  border-radius: 5px;
  position: absolute;
  text-align: center;
  box-shadow: 0px 8px 54px 0px #1d2331;

  i {
    font-size: 90px;
    color: #fff;
    margin-top: 10px;
  }

  h2 {
    color: #fff;
    margin-top: 10px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  p {
    margin-top: 10px;
    color: #fff;
  }
}

.error-message {
  margin-bottom: 0;
  color: #e45164;
}
</style>
