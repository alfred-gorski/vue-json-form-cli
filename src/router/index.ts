import DrawFlowVue from "@/views/DrawFlow.vue";
import WorkStationVue from "@/views/WorkStation.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "DrawFlow",
    component: DrawFlowVue,
  },
  {
    path: "/workstation/:id",
    name: "WorkStation",
    component: WorkStationVue,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
