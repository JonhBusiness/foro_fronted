<template>
    <div class="mx-auto max-w-[450px] space-y-6">
        <div class="space-y-2 text-center">
            <h1 class="text-3xl font-bold">Register</h1>
            <p class="text-muted-foreground">Create a new account to get started.</p>
        </div>
        <form class="rounded-lg border bg-card text-card-foreground shadow-sm" @submit.prevent="handleSubmit" data-v0-t="card">
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2" for="new-username"> Username </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="authData.username"
                    type="Username"
                    placeholder="Username"
                />
            </div>
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2" for="email"> Email </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="authData.email"
                    type="email"
                    placeholder="Email"
                />
            </div>
            <div class="mb-6">
                <label class="block text-zinc-700 text-sm font-bold mb-2" for="new-password"> Password </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 mb-3 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="authData.password"
                    type="password"
                    placeholder="********"
                />
            </div>
            <div class="items-center grid">
                <button
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out"
                    type="submit"
                >
                    Register
                </button>
                <a
                    @click.prevent="$emit('switch-to-login')"
                    class="inline-block mt-4 align-baseline font-bold text-sm text-green-500 hover:text-green-800 cursor-pointer"
                >
                    Already have an account?
                </a>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import authService from "@/components/auth/service/authService";
import { AuthData } from "@/components/home/interfaces/AuthData";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { ErrorCodes, reactive } from "vue";

const authData = reactive<AuthData>({
    email: "",
    username: "",
    password: ""
});

const handleSubmit = async () => {
    try {
        const response = await authService.register(authData.username, authData.email, authData.password);
        if (response.status == 200) {
            Swal.fire({
                title: "Registro exitoso!",
                text: response.data,
                icon: "success",
                confirmButtonText: "Ok"
            });
        }
    } catch (e) {
        const error = e as AxiosError;

        if (!error.response) {
            Swal.fire({
                title: "Error!",
                text: "Ha ocurrido un error desconocido",
                icon: "error",
                confirmButtonText: "Ok"
            });
        } else if (error.response.status === 400) {
            Swal.fire({
                title: "Ups!",
                text: String(error.response.data),
                icon: "info",
                confirmButtonText: "Ok"
            });
        }
    }
    /////Otra forma
    // catch (error) {
    //     if (axios.isAxiosError(error)) {
    //         if (!error.response) {
    //             Swal.fire({
    //                 title: "Error!",
    //                 text: "Ha ocurrido un error desconocido",
    //                 icon: "error",
    //                 confirmButtonText: "Ok"
    //             });
    //         } else if (error.response.status === 400) {
    //             Swal.fire({
    //                 title: "Ups!",
    //                 text: error.response.data,
    //                 icon: "info",
    //                 confirmButtonText: "Ok"
    //             });
    //         }
    //     }
    // }
};
</script>

<style scoped></style>
