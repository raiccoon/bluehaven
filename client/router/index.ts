import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AllClassesView from "../views/AllClassesView.vue";
import ClassView from "../views/ClassView.vue";
import ExpandedPostView from "../views/ExpandedPostView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RegisterView from "../views/RegisterView.vue";
import StartView from "../views/StartView.vue";
import ViewBookmarksView from "../views/ViewBookmarksView.vue";
import BoilerplateView from "../views/boilerplates/BoilerplateView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Start",
      component: StartView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/boilerplate",
      name: "Boilerplate",
      component: BoilerplateView,
      meta: { requiresAuth: true },
    },
    {
      path: "/classes",
      name: "Classes",
      component: AllClassesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Classes" };
        }
      },
    },
    {
      path: "/classes/:classId",
      name: "Class",
      component: ClassView,
      meta: { requiresAuth: true },
    },
    {
      path: "/classes/:classId/bookmarks",
      name: "Bookmarks",
      component: ViewBookmarksView,
      meta: { requiresAuth: true },
    },
    {
      path: "/expanded-post/:postId",
      name: "Expanded-Post",
      component: ExpandedPostView,
      props: { author: "" },
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Start" };
  }
});

export default router;
