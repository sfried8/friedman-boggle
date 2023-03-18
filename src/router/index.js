import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/game",
    name: "Boggle",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/BoggleBoard.vue"),
  },
  {
    path: "/bee",
    name: "SpellingBee",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SpellingBee.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
