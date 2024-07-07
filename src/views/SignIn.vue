<template>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl text-center font-bold mb-4">Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2" for="username"> Username </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="username"
                    type="username"
                    placeholder="Username"
                />
            </div>
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-bold mb-2" for="password"> Password </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 mb-3 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="password"
                    type="password"
                    placeholder="********"
                />
            </div>
            <div class="block items-center justify-between">
                <button
                    class="btn-signin bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out"
                    type="submit"
                >
                    Sign In
                </button>
            </div>
            <div class="mt-4 text-center">
                <p class="text-sm text-zinc-700">
                    Don't have an account?
                    <a
                        class="cursor-pointer font-bold text-blue-500 hover:text-blue-800 transition-colors duration-200 ease-in-out"
                        @click.prevent="$emit('switch-to-register')"
                    >
                        Register here
                    </a>
                </p>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import authService from "@/components/auth/service/authService";
import store from "@/store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { computed, ref } from "vue";

const username = ref("");
const password = ref("");

const handleSubmit = async () => {
    try {
        const response = await authService.login(username.value, password.value);

        if (response.jwt) {
            localStorage.setItem("token", response.jwt);
        }
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken: { role: string } = jwtDecode(token);

            if (decodedToken.role) {
                store.commit("SET_ROLE", decodedToken.role);
            }
        }
        window.location.reload();
        // En lugar de usar router.push, recargamos la página
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (!error.response) {
                Swal.fire({
                    title: "Error!",
                    text: error.response,
                    icon: "error",
                    confirmButtonText: "Ok"
                });
            } else if (error.response.status >= 401) {
                Swal.fire({
                    title: "Ups!",
                    text: error.response.data,
                    icon: "info",
                    confirmButtonText: "Ok"
                });
            }
        }

        // Swal.fire({
        //     title: "Error!",
        //     text: "No se pudo iniciar Sesion",
        //     icon: "error",
        //     confirmButtonText: "Ok"
        // });
    }
};
</script>

<style scoped>
.btn-signin {
    width: -webkit-fill-available;
}
</style>
