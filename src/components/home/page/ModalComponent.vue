<template>
    <div class="fixed inset-0 bg-zinc-800 bg-opacity-50 flex justify-center items-center" @click.self="$emit('close')">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
