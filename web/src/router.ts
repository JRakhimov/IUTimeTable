import Vue from "vue";
import jwt from "jsonwebtoken";
import Router from "vue-router";
import { getModule } from "vuex-module-decorators";

import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import Timetable from "@/views/Timetable.vue";

import store from "./store";
import ProfileModule from "./store/profile";
import GetDarkenColor from "./mixins/getDarkenColor";

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/timetable"
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        layout: "login",
        routeColor: "#1D2331"
      }
    },
    {
      path: "/timetable",
      name: "timetable",
      component: Timetable,
      meta: {
        routeColor: "#5A97E5"
      }
    },
    // {
    //   path: "/groupmates",
    //   name: "groupmates",
    //   component: Groupmates,
    //   meta: {
    //     routeColor: "#8F75D3"
    //   }
    // },
    // {
    //   path: "/friends",
    //   name: "friends",
    //   component: Friends,
    //   meta: {
    //     routeColor: "#34B696"
    //   }
    // },
    // {
    //   path: "/friends/:friendID",
    //   name: "friends-timetable",
    //   component: Timetable,
    //   meta: {
    //     routeColor: "#34B696"
    //   }
    // },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        routeColor: "#E45164"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const Profile = getModule(ProfileModule, store);

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];
  const authRequired = publicPages.includes(to.path);
  const jwtToken = localStorage.getItem("jwt");

  const themeColor = document.getElementsByName("theme-color")[0] as HTMLMetaElement;

  setTimeout(
    () => (themeColor.content = GetDarkenColor.shadeColor(to.meta.routeColor || "#1D2331", -15)),
    100
  );

  if (!authRequired && !jwtToken) {
    // Page requires authorization and user doesnt have JWT token
    return next("/login");
  }

  if (jwtToken && to.name === "login") {
    // JWT token exists and we try to go to page login
    return next("/timetable");
  }

  if (jwtToken && !Profile.getProfile.studentID) {
    const decodedJWT = jwt.decode(jwtToken) as { studentID: string };

    store.dispatch("fetchProfile", decodedJWT.studentID);
  }

  next();
});
