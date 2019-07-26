import Vue from "vue";
import jwt from "jsonwebtoken";
import Router from "vue-router";

import Login from "@/views/Login.vue";
import Timetable from "@/views/Timetable.vue";

import store from "./store";
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
    }
  ]
});

router.beforeEach((to, from, next) => {
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

  if (jwtToken && !store.state.profile.studentID) {
    const decodedJWT = jwt.decode(jwtToken) as { studentID: string };

    store.dispatch("fetchProfile", decodedJWT.studentID);
  }

  next();
});
