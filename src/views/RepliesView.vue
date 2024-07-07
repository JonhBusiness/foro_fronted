<template>
    <div class="flex h-screen w-full flex-col">
        <HeaderComponent></HeaderComponent>
        <main class="flex-1 bg-gray-100 p-6">
            <div class="container mx-auto replycss">
                <div class="mb-6 flex items-center justify-between">
                    <h1 class="text-2xl text-black font-bold">Replies for {{ topicoSelecionado }}</h1>
                </div>
                <div class="bg-white p-4 rounded shadow mb-4">
                    <h3 class="font-bold">@{{ byUsuario }}</h3>
                    <p class="mb-4">{{ mensaje }}</p>
                </div>
                <div v-for="reply in replies" :key="reply.id" class="grid gap-3">
                    <hr />
                    <div class="space-y-4">
                        <div class="bg-accent replycss group block rounded-lg shadow-md p-4">
                            <h3 class="font-bold">@{{ reply.autor }}</h3>
                            <p>{{ reply.mensaje }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-6">
                    <textarea
                        class="flex min-h-[80px] bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your reply..."
                        v-model="respuesta"
                    ></textarea>

                    <div class="pt-3">
                        <button
                            @click.prevent="publicar()"
                            class="bg-black text-white font-medium font-serif hover:opacity-80 transition-opacity inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Submit Reply
                        </button>
                    </div>
                </div>
            </div>
        </main>
        <footer class="bg-gray-900 py-4 px-6 text-white">
            <div class="container mx-auto text-center">© 2023 Forum. All rights reserved.</div>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps } from "vue";
import HeaderComponent from "../components/home/page/HeaderComponent.vue";
import { Reply } from "@/components/home/interfaces/Reply";
import HomeService from "../components/home/service/homeService";
import homeService from "../components/home/service/homeService";
import Swal from "sweetalert2";

const replies = ref<Reply[]>([]);
const topicoSelecionado = ref("");
const mensaje = ref("");
const respuesta = ref("");
const byUsuario = ref("");
const props = defineProps<{ id: number }>();

const fetchReplies = async () => {
    try {
        const response = await HomeService.getRepliesBoard(props.id);
        console.log("response:", response);
        if (response.data && response.data.respuestas) {
            replies.value = response.data.respuestas;
            topicoSelecionado.value = response.data.titulo;
            mensaje.value = response.data.mensaje;
            byUsuario.value = response.data.usuario;
        }
    } catch (error) {
        console.error("Error fetching replies:", error);
    }
};

async function publicar() {
    console.log("ID:", props.id);
    try {
        const response = await homeService.createReplies(props.id, respuesta.value);

        if (response.data) {
            const newRespuesta: Reply = response.data;
            replies.value.push(newRespuesta); // Add new reply to replies array
            respuesta.value = ""; // Clear the textarea

            Swal.fire({
                title: "Registro exitoso!",
                text: "Se ha creado nueva Respuesta.",
                icon: "success",
                confirmButtonText: "Ok"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "No se pudo agregar la respuesta",
            icon: "error",
            confirmButtonText: "Ok"
        });
    }
}

onMounted(fetchReplies);
</script>

<style scoped>
.replycss {
    text-align: -webkit-left;
}
.fle {
    display: ruby-text;
}
</style>
