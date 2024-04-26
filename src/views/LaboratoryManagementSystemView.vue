<script lang="ts">
import { ref } from 'vue';
import { store } from '../store.js';
import CompoundManager from '@/components/CompoundManager.vue';
import ExperimentManager from '@/components/ExperimentManager.vue';
import SampleManager from '@/components/SampleManager.vue';
import {
    mdiMolecule,
    mdiTestTube,
    mdiBottleTonic,
    mdiFlaskEmpty
} from '@mdi/js'

const currentContent = ref("");

const setCurrentContent = (content: string) => {
    currentContent.value = content
}


export default {
    components: {
        CompoundManager,
        ExperimentManager,
        SampleManager
    },

    setup() {
        return {
            currentContent,
            mdiBottleTonic,
            mdiTestTube,
            mdiMolecule,
            mdiFlaskEmpty,
            setCurrentContent
        }
    },

    async beforeRouteEnter() {
        store.loading = 'false';
    },

    beforeRouteLeave() {
        store.loading = 'true';
    },
}
</script>

<template>
    <div class="main-wrapper">
        <div class="side-bar">
            <div class="side-bar-item" @click="setCurrentContent('compound')">
                <v-icon :icon=mdiMolecule size="30"></v-icon>
            </div>
            <div class="side-bar-item" @click="setCurrentContent('experiment')">
                <v-icon :icon=mdiTestTube size="30"></v-icon>
            </div>
            <div class="side-bar-item" @click="setCurrentContent('sample')">
                <v-icon :icon=mdiBottleTonic size="30"></v-icon>
            </div>
        </div>
        <div class="main-content">
            <div class="main-content-default fade-in-bottom" v-if="currentContent == ''">
                <v-icon :icon=mdiFlaskEmpty size="50" color="rgb(174, 174, 174)"></v-icon>
                <p>Laboratory Management System</p>
            </div>
            <CompoundManager v-if="currentContent == 'compound'" />
            <ExperimentManager v-if="currentContent == 'experiment'" />
            <SampleManager v-if="currentContent == 'sample'" />
        </div>
    </div>
    <Teleport to="body">
    </Teleport>
</template>

<style scoped>
.main-wrapper {
    display: flex;
    height: calc(100vh - 35px);
    width: 100vw;
}

.side-bar {
    display: flex;
    width: 3.5vw;
    background-color: rgb(205, 233, 251);
    height: calc(100vh - 35px);
    flex-flow: column;
    overflow-y: scroll;
    border-right: 1px solid rgb(200, 200, 200);
}

.side-bar::-webkit-scrollbar {
    display: none;
}

.side-bar-item {
    display: flex;
    cursor: pointer;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    padding: 5px;
    flex: 1;
    border-bottom: 1px solid rgb(200, 200, 200);
}

.side-bar-item:hover {
    background-color: rgb(180, 225, 235);
}

.main-content {
    width: 97vw;
}

.main-content-default {
    flex: 6;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
}

.main-content-default p {
    padding-left: 10px;
}

.fade-in-bottom {
    opacity: 0;
    animation-name: fadein-bottom;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}

@keyframes fadein-bottom {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>