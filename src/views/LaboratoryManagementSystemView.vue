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
            <div class="side-bar-item compound-manager-btn" @click="setCurrentContent('compound')">
                <!-- <v-icon :icon=mdiMolecule size="30" color="rgb(120, 120, 120)"></v-icon> -->
                化 合 物 管 理
            </div>
            <div class="side-bar-item experiment-manager-btn" @click="setCurrentContent('experiment')">
                <!-- <v-icon :icon=mdiTestTube size="30" color="rgb(120, 120, 120)"></v-icon> -->
                実 験 管 理
            </div>
            <div class="side-bar-item sample-manager-btn" @click="setCurrentContent('sample')">
                <!-- <v-icon :icon=mdiBottleTonic size="30" color="rgb(120, 120, 120)"></v-icon> -->
                サ ン プ ル 管 理
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
    width: 2.5vw;
    height: calc(100vh - 35px);
    flex-flow: column;
    overflow-y: scroll;
    border-right: 1px solid rgb(200,200,200);
    border-bottom: 1px solid rgb(200,200,200);
    /* border-right: 1px solid white; */
}

.side-bar::-webkit-scrollbar {
    display: none;
}

.side-bar-item {
    writing-mode: vertical-rl;
    display: flex;
    cursor: pointer;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    padding: 5px;
    flex: 1;
    /* background-color: rgb(41, 138, 236); */

}

.side-bar-item:hover {
    background-color: rgb(180, 225, 235);
}

.compound-manager-btn {
    background-color: #ffdfdf;
}

.experiment-manager-btn {
    background-color: #faffdf;

}

.sample-manager-btn {
    background-color: #dfffee;
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