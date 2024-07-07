<template>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl text-center font-bold mb-4">Create New Course</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2"> Nombre</label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105"
                    v-model="nombre"
                    type="text"
                    required
                />
            </div>
            <div class="mb-4">
                <label class="block text-zinc-700 text-sm font-bold mb-2"> Description</label>
                <textarea v-model="descripcion" class="w-full p-2 border rounded-lg" rows="4" required></textarea>
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
import authService from "@/components/auth/service/authService";
import { Curso } from "@/components/home/interfaces/Curso";
import homeService from "@/components/home/service/homeService";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, defineEmits, reactive } from "vue";

const nombre = ref("");
const descripcion = ref("");

const emit = defineEmits(["courseCreated", "close"]);
async function handleSubmit() {
    console.log("Curso creado");
    try {
        const response = await homeService.createCourses(nombre.value, descripcion.value);
        const newCourse: Curso = response.data;
        Swal.fire({
            title: "Registro exitoso!",
            text: "Se ha creado nuevo Curso.",
            icon: "success",
            confirmButtonText: "Ok"
        });
        emit("courseCreated", newCourse); // Emitir evento con el nuevo curso
        emit("close"); // Cerrar el modal después de crear el curso
    } catch (e) {
        //    console.error("Error creating curso:", error);

        if (axios.isAxiosError(e)) {
            if (e.response?.status == 409) {
                Swal.fire({
                    title: "Error!",
                    text: e.response.data,
                    icon: "error",
                    confirmButtonText: "Ok"
                });
            }
        }
    }
}
</script>

<style scoped></style>
