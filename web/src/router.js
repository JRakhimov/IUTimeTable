import Vue from "vue";
import jwt from "jsonwebtoken";
import Router from "vue-router";

import Login from "./views/Login.vue";
import Friends from "./views/Friends.vue";
import Profile from "./views/Profile.vue";
import Timetable from "./views/Timetable.vue";
import Groupmates from "./views/Groupmates.vue";

import store from "./store";

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
        routeColor: "#1d233"
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
    {
      path: "/groupmates",
      name: "groupmates",
      component: Groupmates,
      meta: {
        routeColor: "#8F75D3"
      }
    },
    {
      path: "/friends",
      name: "friends",
      component: Friends,
      meta: {
        routeColor: "#34B696"
      }
    },
    {
      path: "/friends/:friendID",
      name: "friends-timetable",
      component: Timetable,
      meta: {
        routeColor: "#34B696"
      }
    },
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

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];
  const authRequired = publicPages.includes(to.path);
  const jwtToken = localStorage.getItem("jwt");

  const [themeColor] = document.getElementsByName("theme-color");
  themeColor.content = to.meta.routeColor || "#1d233";

  if (!authRequired && !jwtToken) {
    // Page requires authorization and user doesnt have JWT token
    return next("/login");
  }

  if (jwtToken && to.name === "login") {
    // JWT token exists and we try to go to page login
    return next("/timetable");
  }

  if (jwtToken && !store.state.profile.studentID) {
    const decodedJWT = jwt.decode(jwtToken);

    store.dispatch("fetchProfile", decodedJWT.studentID);
  }

  next();
});
