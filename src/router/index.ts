import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../components/home/page/HomeView.vue";
import LoginView from "../components/auth/login/LoginView.vue";
import RegisterView from "../components/auth/login/RegisterView.vue";
import TopicsView from "../views/TopicsView.vue";
import RepliesView from "../views/RepliesView.vue";
import store from "@/store";
import Swal from "sweetalert2";
import axios from "axios";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: HomeView,
        meta: { guest: true }
    },
    {
        path: "/cursos/:id/topics",
        name: "topics",
        component: TopicsView,
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/topics/:id/replies",
        name: "replies",
        component: RepliesView,
        meta: {
            requiresAuth: true
        },
        props: true
    }
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
// const router = createRouter({
//     history: createWebHashHistory(),
//     routes
// });
// Guardia de navegación
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next({
                path: "/",
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

// Interceptor de Axios
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpia el token y cierra la sesión
            store.dispatch("logout"); // Asume que tienes una acción 'logout' en tu store
            const mensaje = error.response.data;
            Swal.fire({
                title: "Ups",
                text: mensaje + " Vuelva a iniciar sesión.",
                icon: "warning",
                confirmButtonText: "Iniciar sesión"
            }).then(() => {
                router.push({
                    path: "/",
                    query: { redirect: router.currentRoute.value.fullPath }
                });
            });
        }
        return Promise.reject(error);
    }
);
// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//     const guestOnly = to.matched.some((record) => record.meta.guest);
//     const isAuthenticated = store.getters.isAuthenticated;

//     if (requiresAuth && !isAuthenticated) {
//         Swal.fire({
//             title: "No has iniciado sesión",
//             text: "Por favor, inicia sesión para acceder al curso.",
//             icon: "warning",
//             confirmButtonText: "Iniciar sesión"
//         }).then(() => {
//             next({
//                 path: "/login",
//                 query: { redirect: to.fullPath }
//             });
//         });
//     } else if (guestOnly && isAuthenticated) {
//         next({ name: "home" }); // Redirigir al usuario autenticado
//     } else {
//         next();
//     }
// });

export default router;
