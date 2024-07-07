<template>
    <div class="flex h-screen w-full flex-col">
        <HeaderComponent></HeaderComponent>
        <main class="flex-1 bg-gray-100 p-6">
            <div class="container mx-auto">
                <div class="grid gap-3">
                    <div class="mb-6 flex items-center justify-between">
                        <h1 class="text-2xl text-black font-bold">Topics of {{ cursoSelecionado }}</h1>
                        <button
                            @click.prevent="showModal()"
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
                            Create Topic
                        </button>
                    </div>
                    <hr />
                    <div v-for="topic in topics" :key="topic.id" class="grid grid-cols-1 gap-4">
                        <router-link :to="`/topics/${topic.id}/replies`" class="group block rounded-lg bg-white p-4 shadow-md hover:bg-gray-100">
                            <div class="mb-2 text-lg font-bold flex">{{ topic.titulo }}</div>
                            <div class="p-4 flex">
                                <p class="text-muted-foreground">{{ topic.mensaje }}</p>
                            </div>
                            <div class="flex justify-end">
                                <p class="text-sm text-zinc-500">Posted by: {{ topic.usuario }}</p>
                            </div>

                            <div class="flex items-center justify-between">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    {{ topic.numRespuestas }} Respuestas
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </main>
        <footer class="bg-gray-900 py-4 px-6 text-white">
            <div class="container mx-auto text-center">© 2024 Forum. All rights reserved.</div>
        </footer>
        <ModalComponent v-if="showCreateTopic" @close="hideModal">
            <CreateTopicModal :id="props.id" @close="hideModal" @topicCreated="onTopicCreated" />
        </ModalComponent>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps } from "vue";
import HomeService from "../components/home/service/homeService";
import { Topic } from "../components/home/interfaces/Topic";
import HeaderComponent from "../components/home/page/HeaderComponent.vue";
import CreateTopicModal from "../views/CreateTopicModal.vue";
import ModalComponent from "../components/home/page/ModalComponent.vue";

const topics = ref<Topic[]>([]);
const cursoSelecionado = ref("");

const showCreateTopic = ref(false);
const showModal = () => {
    showCreateTopic.value = true;
};
const hideModal = () => {
    showCreateTopic.value = false;
};
const props = defineProps<{ id: number }>();

const fetchTopics = async () => {
    try {
        const response = await HomeService.getTopicsBoard(props.id);
        if (response.data && response.data.topicos) {
            topics.value = response.data.topicos;
            cursoSelecionado.value = response.data.nombre;
        }
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
};
function onTopicCreated(response: any) {
    console.log("datosTopico", response.data);
    const newTopic: Topic = response.data;
    topics.value.push(newTopic);
}
onMounted(fetchTopics);
</script>

<style scoped></style>
