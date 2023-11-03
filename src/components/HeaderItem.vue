<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
    name: string
    icon: string
    routerName : string
}>()
</script>

<template>
    <router-link :to="{name: routerName}">
        <div class="header-item">
            <v-icon :icon=icon></v-icon>
        </div>
    </router-link>
</template>

<style scoped>
.header-item {
    text-align: center;
    padding: 5px;
}

.header-item p{
    font-size: 14px;
    padding: 1px 0;
}
</style>