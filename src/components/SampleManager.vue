<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiBottleTonic,
    mdiPlus,
    mdiMagnify
} from '@mdi/js'
import InsertSampleModal from '@/components/InsertSampleModal.vue';

const showInsertSampleModal = ref(false);
const samplesList = ref();
const isLoadingList = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000));

const getAllSamplesList = async () => {
    isLoadingList.value = true;
    try {
        samplesList.value = await fetch('./api_lms/getAllSamplesList.php')
            .then(function (res) {
                return res.json()
            })
    } catch {
        samplesList.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS001 crude", "memo": "", "preparation_date": "2024-04-01" }, { "id": 2, "created_at": "2024-04-02", "updated_at": "2024-04-02", "compound_id": null, "state_id": 2, "current_weight": 0, "label": "KS001 p1 bypro", "memo": "", "preparation_date": "2024-04-02" }, { "id": 3, "created_at": "2024-04-02", "updated_at": "2024-04-02", "compound_id": 1, "state_id": 3, "current_weight": 0, "label": "KS001 p2", "memo": "", "preparation_date": "2024-04-02" }, { "id": 4, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS002 crude", "memo": "", "preparation_date": "2024-04-04" }, { "id": 5, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": null, "state_id": 3, "current_weight": 1.233, "label": "KS002 p1 bypro", "memo": "", "preparation_date": "2024-04-04" }, { "id": 6, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": 1, "state_id": 3, "current_weight": 3.21, "label": "KS002 p2", "memo": "", "preparation_date": "2024-04-04" }, { "id": 7, "created_at": "2024-04-05", "updated_at": "2024-04-05", "compound_id": 2, "state_id": 1, "current_weight": 2.324, "label": "KS003 crude", "memo": "", "preparation_date": "2024-04-05" }] };
    }
    isLoadingList.value = false;
}

onMounted(() => {
    getAllSamplesList();
});
</script>

<template>
    <div class="main-area">
        <div class="sm-side-bar">
            <div class="sm-header">
                <div class="sm-header-left">
                    <p>サンプルリスト</p>
                </div>
                <div class="sm-header-right">
                    <button class="btn-default btn-small">
                        <v-icon :icon="mdiMagnify" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                    <button class="btn-default btn-small">
                        <v-icon @click="showInsertSampleModal = true" :icon="mdiPlus" size=20
                            color="rgb(95, 95, 95)"></v-icon>
                    </button>
                </div>
            </div>
            <div class="sm-samples-list">
                <div v-if="isLoadingList || samplesList == null">
                    Loading...
                </div>
                <div v-else-if="samplesList['error']">
                    データ取得に失敗しました。
                </div>
                <router-link :to="('/lab-management/sample/' + sample['id']).toString()" v-else
                    v-for="sample in samplesList['content']" class="sm-item">
                    <div>
                        <p>{{ sample['label'] }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="sm-main-content">
            <div class="sm-main-content-default">
                <v-icon :icon=mdiBottleTonic size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <router-view />
        </div>
    </div>
    <Teleport to="body">
        <InsertSampleModal :show="showInsertSampleModal" @close="showInsertSampleModal = false" @submit="async () => {
                            await sleep(0.5);
                            isLoadingList = true;
                            await getAllSamplesList();
                            isLoadingList = false;
                            showInsertSampleModal = false;
                        }">
        </InsertSampleModal>
    </Teleport>
</template>

<style scoped>
.main-area {
    display: flex;
    width: 97.5vw;
    position: absolute;
    background-color: white;
}

.sm-side-bar {
    width: 30vw;
    height: calc(100vh - 35px);
    border-right: 1px solid rgb(200, 200, 200);
}

.sm-header {
    display: flex;
    height: 40px;
    padding: 0 15px;
    color: white;
    background-color: rgb(37, 154, 66);
}

.sm-header-left {
    display: flex;
    align-items: center;
    flex: 1;
}

.sm-header-right {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.sm-header-right button {
    margin-left: 7px;
}

.sm-samples-list {
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.sm-item {
    display: flex;
    padding: 10px;
    height: 40px;
    border-bottom: 1px solid rgb(200, 200, 200);
    cursor: pointer;
    align-items: center;
    text-decoration: none;
    color: black;
}

.sm-item:hover {
    background-color: rgb(235, 235, 235);
}

.sm-main-content {
    width: 67.5vw;
    position: relative;
}

.sm-main-content-default {
    width: 67.5vw;
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
    position: absolute;
}

.sm-details-sm-info {
    display: flex;
    margin-bottom: 5px;
}


.sm-details-sm-info-item {
    flex: 1;
}


.sm-details-sm-info-item-nav {
    font-weight: 900;
    flex: 1;
}

.sm-details-subarea {
    margin-bottom: 20px;
}

.sm-details-area-compound {
    display: flex;
}

.sm-details-area-compound>img {
    height: 200px;
    width: 300px;
    object-fit: contain;
    margin-right: 20px;
}

.sm-details-area {
    padding: 20px;
    overflow-y: scroll;
    height: calc(100vh - 75px);
}
</style>