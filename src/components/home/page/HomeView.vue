<template>
    <div class="flex h-screen w-full flex-col">
        <HeaderComponent @show-login-modal="showLoginModal() ? true : false" @show-register-modal="showRegisterModal() ? true : false" />
        <main class="flex-1 bg-gray-100 p-6">
            <div class="container mx-auto">
                <div v-if="isLoading" class="text-center">
                    <p>Cargando cursos...</p>
                    <!-- Puedes agregar un spinner aquí si lo deseas -->
                </div>
                <div v-else class="grid gap-3">
                    <div class="mb-6 flex items-center justify-between">
                        <h1 class="text-2xl text-black font-bold">Courses</h1>
                        <button
                            @click.prevent="showModal()"
                            v-if="roleAuth == 'ADMIN'"
                            class="bg-black text-white font-medium font-serif hover:opacity-80 transition-opacity inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                                class="mr-2 h-4 w-4"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                            Create Course
                        </button>
                    </div>
                    <hr />
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <div
                            v-for="curso in cursos"
                            :key="curso.id"
                            class="group block rounded-lg bg-white p-4 shadow-md hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                        >
                            <div class="mb-2 text-lg font-bold">{{ curso.nombre }}</div>
                            <p class="text-gray-500">{{ curso.descripcion }}</p>
                            <div class="mt-4 flex items-center justify-between font-mono">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    data-v0-t="badge"
                                >
                                    Tópicos: {{ curso.topicos }}
                                </div>
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    data-v0-t="badge"
                                >
                                    Respuestas: {{ curso.respuestas }}
                                </div>
                            </div>
                            <div v-if="isAuth" class="mt-4">
                                <router-link :to="`/cursos/${curso.id}/topics`" class="text-blue-500 hover:underline">Ver curso</router-link>
                            </div>
                            <div v-else class="mt-4">
                                <a @click.prevent="showLoginMessage" class="text-blue-500 hover:underline cursor-pointer">Ver curso</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer class="bg-gray-900 py-4 px-6 text-white">
            <div class="container mx-auto text-center">© 2024 Forum. All rights reserved.</div>
        </footer>

        <ModalComponent v-if="showLogin" @close="hideModals">
            <SignIn @switch-to-register="switchToRegister" />
        </ModalComponent>

        <ModalComponent v-if="showRegister" @close="hideModals">
            <SignUp @switch-to-login="switchToLogin" />
        </ModalComponent>
        <ModalComponent v-if="modalValue" @close="hideModal">
            <CreateCourseModal @close="hideModal" @courseCreated="onCourseCreated" />
        </ModalComponent>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import homeService from "../service/homeService";
import Swal from "sweetalert2";
import { Curso } from "../interfaces/Curso";
import store from "@/store";
import HeaderComponent from "./HeaderComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import SignIn from "../../../views/SignIn.vue";
import SignUp from "../../../views/SignUp.vue";
import CreateCourseModal from "../../../views/CreateCourseModal.vue";

const cursos = reactive<Curso[]>([]);
const isLoading = ref(true);
const isAuth = computed(() => store.getters.isAuthenticated);
const roleAuth = computed(() => store.getters.role);
onMounted(async () => {
    try {
        const response = await homeService.getInitBoard();
        if (response && response.data) {
            cursos.push(...response.data);
        }
    } catch (e) {
        console.error(e);
        Swal.fire({
            title: "Error!",
            text: "No se pudieron cargar los cursos",
            icon: "error",
            confirmButtonText: "Ok"
        });
    } finally {
        isLoading.value = false;
    }
});
const showLoginMessage = () => {
    Swal.fire({
        title: "Acceso restringido",
        text: "Debes iniciar sesión para acceder a este curso",
        icon: "info",
        confirmButtonText: "Entendido"
    });
};
const showLogin = ref(false);
const showRegister = ref(false);
const modalValue = ref(false);

const showLoginModal = (): boolean => {
    return (showLogin.value = !showLogin.value);
};

const showRegisterModal = () => {
    return (showRegister.value = !showRegister.value);
};

const hideModals = () => {
    showLogin.value = false;
    showRegister.value = false;
};

const switchToLogin = () => {
    showRegister.value = false;
    showLogin.value = true;
};

const switchToRegister = () => {
    showLogin.value = false;
    showRegister.value = true;
};
function showModal() {
    modalValue.value = true;
}
function hideModal() {
    modalValue.value = false;
}

function onCourseCreated(newCourse: Curso) {
    console.log("Nuevo curso:", newCourse);
    cursos.push(newCourse);
}
</script>

<style scoped>
body {
    font-family: var(--font-chivo), sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-arimo), sans-serif;
}
</style>
