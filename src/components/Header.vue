<script setup lang="ts">
import HeaderItem from './HeaderItem.vue';
import { ref, onBeforeUnmount } from 'vue';
import {
    mdiHome,
    mdiPen,
    mdiLoading,
    mdiElectronFramework,
} from '@mdi/js'
import { store } from '../store.js';
import Widget from './Widget.vue';

const headerItems = ref([
    { name: "Home", icon: mdiHome, routerName: "home" },
    { name: "Memo", icon: mdiPen, routerName: "memo" },
    // { name: "Article", icon: mdiNewspaper, routerName: "article" },
    // { name: "Editorial", icon: mdiMessageTextOutline, routerName: "editorial" },
])

const useCurrentTime = () => {
    const currentTime = ref(new Date());
    const updateCurrentTime = () => {
        currentTime.value = new Date();
    };
    const updateTimeInterval = setInterval(updateCurrentTime, 1000);
    onBeforeUnmount(() => {
        clearInterval(updateTimeInterval);
    });
    return {
        currentTime,
    };
};

const { currentTime } = useCurrentTime();
</script>

<template>
    <header>
        <div class="header-left-align">
            <div class="header-items">
                <HeaderItem v-for="item in headerItems" :name="item.name" :icon="item.icon"
                    :router-name="item.routerName" />
            </div>
        </div>
        <div class="header-right-align">
            <v-icon v-if="store.loading === 'true'" :icon="mdiLoading" size=30 class="loading-spinner"></v-icon>
            <div class="widget-area">
                <Widget />
            </div>
            <div class="clock">
                <p>{{ currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    display: flex;
    background-color: rgb(250, 250, 250);
    color: rgb(95, 95, 95);
    line-height: 0.5;
    border-bottom: 1px solid rgb(200, 200, 200);
    height: 35px;
}

.header-left-align {
    display: flex;
    align-items: center;
    justify-content: left;
    padding-left: 1px;
}

.header-right-align {
    flex: 100;
    display: flex;
    align-items: center;
    justify-content: right;
}

header i {
    margin: 0 10px;
}

header a {
    transition: 0.1s;
    width: 50px;
    color: rgb(95, 95, 95);
    border-radius: 10px;
    text-decoration: none;
}

header a:hover {
    background-color: rgb(235, 235, 235);
}

.header-items {
    display: flex;
    flex-wrap: wrap;
}

header .clock {
    padding: 0 10px;
    border-left: 1px solid rgb(200, 200, 200);
    font-size: 12px;
    height: 25px;
    text-align: right;
    display: flex;
    align-items: center;
}

.widget-area {
    display: flex;
    width: 100px;
    /* height: 45px; */
    align-items: center;
    justify-content: center;
    border-left: 1px solid rgb(200, 200, 200);
}

.loading-spinner {
    animation: rotate linear 0.4s infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
