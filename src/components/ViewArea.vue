<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="main-area">
        <RouterView />
    </div>
</template>

<style scoped>
.main-area {
    white-space: pre-wrap;
    height: calc(100vh - 35px);
}
</style>
