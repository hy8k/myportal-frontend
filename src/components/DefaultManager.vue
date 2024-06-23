<script setup lang="ts">
import {
    mdiFlaskEmpty
} from '@mdi/js'

</script>

<template>
    <div class="main-content-default fade-in-bottom">
        <v-icon :icon=mdiFlaskEmpty size="50" color="rgb(174, 174, 174)"></v-icon>
        <p>Laboratory Management System</p>
    </div>
</template>

<style scoped>
.main-content-default {
    flex: 6;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
    z-index: -100;
}

.main-content-default p {
    padding-left: 10px;
}
</style>