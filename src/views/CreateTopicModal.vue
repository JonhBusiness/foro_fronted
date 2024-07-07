<template>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl text-center font-bold mb-4">Create New Topic</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2"> Title</label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="titulo"
                    type="text"
                    required
                />
            </div>
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2"> Mensaje</label>
                <textarea v-model="mensaje" class="w-full p-2 border rounded-lg" rows="4" required></textarea>
            </div>
            <div class="flex justify-between">
                <button
                    @click.self="$emit('close')"
                    type="button"
                    class="cursor-pointer font-bold text-blue-500 hover:text-blue-800 transition-colors duration-200 ease-in-out"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="cursor-pointer font-bold text-blue-500 hover:text-blue-800 transition-colors duration-200 ease-in-out"
                >
                    Create
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { Topic } from "@/components/home/interfaces/Topic";
import homeService from "@/components/home/service/homeService";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, defineProps, defineEmits } from "vue";

const titulo = ref("");
const mensaje = ref("");

const props = defineProps<{ id: number }>();
const emit = defineEmits(["topicCreated", "close"]);

async function handleSubmit() {
    console.log("Id del curso:", props.id);
    try {
        console.log("Topico creado");

        const response = await homeService.createTopics(props.id, titulo.value, mensaje.value);

        console.log("respuesta:", response);

        Swal.fire({
            title: "Registro exitoso!",
            text: "Se ha creado nuevo Topico.",
            icon: "success",
            confirmButtonText: "Ok"
        });
        emit("topicCreated", response);
        emit("close");
    } catch (e) {
        if (axios.isAxiosError(e)) {
            if (!e.response) {
                Swal.fire({
                    title: "Error!",
                    text: "Ha ocurrido un error desconocido",
                    icon: "error",
                    confirmButtonText: "Ok"
                });
            } else if (e.response.status === 409) {
                Swal.fire({
                    title: "Error!",
                    text: e.response?.data,
                    icon: "error",
                    confirmButtonText: "Ok"
                });
            }
        }
    }
}
</script>

<style scoped></style>
