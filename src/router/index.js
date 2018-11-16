import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home";
import Workout from "@/components/Workout";
import Train from "@/components/Train";

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      //name: "Home",
      component: Workout
    },
    {
      path: "/train",
      //name: "Train",
      component: Train
    }
  ]
});
