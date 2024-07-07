import { createStore } from "vuex";

export default createStore({
    state: {
        role: localStorage.getItem("role") || "",
        token: localStorage.getItem("token") || null,
        authentication: localStorage.getItem("token") ? true : false
    },
    getters: {
        token: (state) => state.token,
        isAuthenticated: (state) => state.authentication,
        role: (state) => state.role
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_AUTHENTICATION: (state, authentication) => {
            state.authentication = authentication;
        },
        CLEAR_TOKEN: (state) => {
            state.token = null;
            state.authentication = false;
            state.role = "";
            localStorage.removeItem("role");
            localStorage.removeItem("token");
        },
        SET_ROLE: (state, role) => {
            state.role = role;
            localStorage.setItem("role", role);
        }
    },
    actions: {
        logout({ commit }) {
            commit("CLEAR_TOKEN");
        }
    },
    modules: {}
});
