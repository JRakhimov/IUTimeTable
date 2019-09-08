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
                :disabled="isOffline || loading"
                prepend-icon="account_circle"
                v-model="formData.studentID"
                :rules="studentIDRules"
                @focus="resetError()"
                label="StudentID"
                name="StudentID"
                :counter="max"
                type="text"
                prefix="U"
                clearable
                required
              ></v-text-field>
            </v-flex>

            <v-flex>
              <v-text-field
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                :disabled="isOffline || loading"
                v-model="formData.password"
                :rules="passwordRules"
                @focus="resetError()"
                prepend-icon="lock"
                label="Password"
                name="Password"
                clearable
                required
              ></v-text-field>
            </v-flex>

            <v-flex align-self-center v-if="error">
              <p class="error-message">{{ message }}</p>
            </v-flex>

            <v-flex align-self-center mb-3>
              <v-btn
                :color="error ? '#E45164' : '#1976d2'"
                :disabled="!valid || isOffline"
                @click.prevent="login()"
                :loading="loading"
                type="submit"
                large
                text
              >Login</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import axios from "axios";
import md5 from "md5";

import VueOfflineMixin from "../mixins/vueOffline";
import { ProfileModule } from "../store";
import { Student } from "../types";

type AuthResponse = {
  status: boolean;
  jwt?: string;
  student?: Student;
  message?: string;
};

@Component
export default class DefaultLayout extends Mixins(VueOfflineMixin) {
  private showPassword = false;
  private loading = false;
  private valid = false;
  private error = false;
  private message = "";

  private studentIDRules = [
    (v: string) =>
      (v || "").length === 7 || `StudentID should containt 7 characters.`,
    (v: string) => !isNaN(Number(v || "")) || "Only numbers are allowed."
  ];
  private passwordRules = [(v: string) => !!v || "Password is required."];
  private max = 7;

  private formData = {
    studentID: "",
    password: ""
  };

  resetError() {
    this.error = false;
  }

  async login() {
    this.error = false;

    let studentID = this.formData.studentID;
    let studentIDArray = studentID.split("");
    studentIDArray.unshift("U");
    studentID = studentIDArray.join("");

    this.loading = true;

    const URL = `${process.env.VUE_APP_HOST_URL}/auth/eclass`;

    try {
      const body = {
        ...this.formData,
        studentID
      };

      const jAuth = md5(
        `${JSON.stringify(body)}${process.env.VUE_APP_STUDENT_SALT}`
      );

      const { data }: { data: AuthResponse } = await axios.post(URL, body, {
        headers: { "J-Auth": jAuth }
      });

      if (data.status && data.jwt && data.student) {
        localStorage.setItem("jwt", data.jwt);
        await ProfileModule.setProfile(data.student);

        this.$router.replace({ name: "timetable" });
      } else {
        this.error = true;
        this.message = data.message || "Error";
      }
    } catch (error) {
      this.error = true;
      this.message = error.message || "Error";

      // tslint:disable-next-line:no-console
      console.log(error);
    }

    this.loading = false;
  }
}
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
  border-radius: 8px;
  position: absolute;
  text-align: center;
  box-shadow: 0px 6px 18px 0px rgba(#1976d2, 0.8);

  i {
    font-size: 90px !important;
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
