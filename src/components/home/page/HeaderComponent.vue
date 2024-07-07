<template>
    <header class="bg-gray-900 py-4 px-6 text-white">
        <div class="container mx-auto flex items-center justify-between">
            <router-link :to="`/`" class="text-2xl font-bold">Forum</router-link>
            <div v-if="!isAuthenticated" class="flex items-center gap-4 font-serif font-semibold">
                <a class="mr-4 hover:underline cursor-pointer" @click.prevent="$emit('show-login-modal')">Login</a>
                <a class="hover:underline cursor-pointer" @click.prevent="$emit('show-register-modal')">Register</a>
            </div>
            <div v-else class="flex items-center space-x-4 relative">
                <div class="flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-5 w-5 text-gray-500"
                    >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span class="text-gray-700 font-medium">{{ user }}</span>
                </div>
                <button
                    @click="toggleMenu"
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-6 w-6"
                    >
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                    <span class="sr-only">Toggle user menu</span>
                </button>
                <div v-if="menuOpen" class="absolute top-16 right-0 bg-white shadow-md border rounded-md w-48 py-2">
                    <div class="flex items-center space-x-2 px-4 py-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-5 w-5 text-gray-500"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span class="text-gray-700 font-medium">{{ role }}</span>
                    </div>
                    <hr />
                    <button @click="logout" class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-5 w-5"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" x2="9" y1="12" y2="12"></line>
                        </svg>
                        <span>Salir</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import authService from "@/components/auth/service/authService";
import router from "@/router";
import store from "@/store";
import { jwtDecode } from "jwt-decode";
import { computed, onMounted, ref } from "vue";

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const menuOpen = ref(false);
const user = ref("");
function toggleMenu() {
    menuOpen.value = !menuOpen.value;
    console.log("user", user.value);
}
const role = localStorage.getItem("role");
function logout() {
    authService.logout();
    router.push({ name: "home" });
    menuOpen.value = false;
}
onMounted(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
        const decodedToken: { sub: string } = jwtDecode(token);

        if (decodedToken.sub) {
            user.value = decodedToken.sub;
        }
    }
});
</script>

<style scoped></style>
