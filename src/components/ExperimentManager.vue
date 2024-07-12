<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiFileQuestion,
    mdiTestTube,
    mdiPlus,
    mdiMagnify
} from '@mdi/js'
import InsertExperimentModal from '@/components/InsertExperimentModal.vue';
import SearchExperimentsModal from '@/components/SearchExperimentsModal.vue';

const showInsertExperimentModal = ref(false);
const showSearchExperimentsModal = ref(false);
const experimentsList = ref();
const samplesListOfExperiment = ref();
const currentExperimentDetails = ref();
const isLoadingList = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))


const setCurrentExperimentDetails = async (experimentId: number) => {
    try {
        await getExperimentInfo(experimentId);
        await getSamplesListOfExperiment(experimentId);
    } catch (e) {
        // currentMode.value = 'error';
        currentExperimentDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "title": "ベンジリデンアセタール化", "implementation_date": "2024-04-01", "memo": "", "compound_name": "ベンジリデンアセタール" }] };
        samplesListOfExperiment.value = { "error": false, "errorMessage": "", "content": [{ "id": 2, "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS002 crude", "memo": "", "preparation_date": "2024-04-04", "compound_name": "ベンジリデンアセタール", "sample_state": "mixture" }, { "id": 2, "compound_id": null, "state_id": 3, "current_weight": 1.233, "label": "KS002 p1 bypro", "memo": "", "preparation_date": "2024-04-04", "compound_name": null, "sample_state": "pure" }, { "id": 2, "compound_id": 1, "state_id": 3, "current_weight": 3.21, "label": "KS002 p2", "memo": "", "preparation_date": "2024-04-04", "compound_name": "ベンジリデンアセタール", "sample_state": "pure" }] }

    }
}


const getAllExperimentsList = async () => {
    isLoadingList.value = true;
    try {
        experimentsList.value = await fetch('./api_lms/getAllExperimentsList.php')
            .then(function (res) {
                return res.json()
            })
    } catch {
        experimentsList.value = { "error": false, "errorMessage": "", "content": [{ "id": 7, "implementation_date": "2024-04-01", "title": "エポキシ化", "compound_name": "エポキシド" }, { "id": 6, "implementation_date": "2024-04-01", "title": "エポキシ化", "compound_name": "エポキシド" }, { "id": 5, "implementation_date": "2024-04-01", "title": "トシル化", "compound_name": "トシラート" }, { "id": 4, "implementation_date": "2024-04-01", "title": "トシル化", "compound_name": "トシラート" }, { "id": 3, "implementation_date": "2024-04-01", "title": "トシル化", "compound_name": "トシラート" }, { "id": 2, "implementation_date": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_name": "ベンジリデンアセタール" }, { "id": 1, "implementation_date": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_name": "ベンジリデンアセタール" }] };
    }
    isLoadingList.value = false;
}

const getExperimentInfo = async (experimentId: number) => {
    currentExperimentDetails.value = await fetch('./api_lms/getExperimentInfo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'experimentId': experimentId
        })
    }).then(function (res) {
        return res.json();
    }).catch(function () {
        throw new Error;
    })
}

const getSamplesListOfExperiment = async (experimentId: number) => {
    samplesListOfExperiment.value = await fetch('./api_lms/getSamplesListOfExperiment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'experimentId': experimentId
        })
    }).then(function (res) {
        return res.json();
    }).catch(function () {
        throw new Error;
    })
}

onMounted(() => {
    getAllExperimentsList();
})
</script>
<template>
    <div class="main-area">
        <div class="em-side-bar">
            <div class="em-header">
                <div class="em-header-left">
                    <p>実験リスト</p>
                </div>
                <div class="em-header-right">
                    <button class="btn-default btn-small">
                        <v-icon :icon="mdiMagnify" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                    <button class="btn-default btn-small">
                        <v-icon @click="showInsertExperimentModal = true" :icon="mdiPlus" size=20
                            color="rgb(95, 95, 95)"></v-icon>
                    </button>
                </div>
            </div>
            <div class="em-experiments-list">
                <div v-if="isLoadingList || experimentsList == null">
                    Loading...
                </div>
                <div v-else-if="experimentsList['error']">
                    データ取得に失敗しました。
                </div>
                <div v-else-if="experimentsList['content'].length == 0">
                    登録されている実験がありません。
                </div>
                <router-link :to="('/lab-management/experiment/' + experiment['id']).toString()" v-else v-for="experiment in experimentsList['content']" class="em-item"
                    @click="setCurrentExperimentDetails(experiment['id'])">
                    <div>
                        <p>KS{{ experiment['id'].toString().padStart(3, '0') }} {{
                            experiment['title'] }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="em-main-content">
            <div class="em-main-content-default">
                <v-icon :icon=mdiTestTube size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <router-view />
        </div>
        <Teleport to="body">
            <InsertExperimentModal :show="showInsertExperimentModal" @close="showInsertExperimentModal = false" @submit="async () => {
                            await sleep(0.5);
                            isLoadingList = true;
                            await getAllExperimentsList();
                            isLoadingList = false;
                            showInsertExperimentModal = false;
                        }">
            </InsertExperimentModal>
            <!-- <SearchtExperimentModal :show="showInsertExperimentModal" @close="showInsertExperimentModal = false" @submit="async () => {
                            await sleep(0.5);
                            isLoadingList = true;
                            await getAllExperimentsList();
                            isLoadingList = false;
                            isDetailsShown = false;
                            showInsertExperimentModal = false;
                        }">
            </SearchExperimentModal> -->
        </Teleport>
    </div>
</template>

<style scoped>
.main-area {
    display: flex;
    width: 97.5vw;
    position: absolute;
    background-color: white;
}

.em-side-bar {
    width: 30vw;
    height: calc(100vh - 35px);
    border-right: 1px solid rgb(200, 200, 200);

}

.em-header {
    display: flex;
    height: 40px;
    padding: 0 15px;
    color: white;
    background-color: rgb(148, 154, 37);
}

.em-header-left {
    display: flex;
    align-items: center;
    flex: 1;
}

.em-header-right {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.em-header-right button {
    margin-left: 7px;
}

.em-experiments-list {
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.em-item {
    display: flex;
    padding: 10px;
    height: 40px;
    border-bottom: 1px solid rgb(200, 200, 200);
    cursor: pointer;
    align-items: center;
    text-decoration: none;
    color:black;
}

.em-item:hover {
    background-color: rgb(235, 235, 235);
}

.em-main-content {
    width: 67.5vw;
}

.em-main-content-default {
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

.em-details-em-info-column {
    display: flex;
    margin-bottom: 5px;
}

.em-details-em-info {
    padding: 10px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
}

.em-details-em-info-column-item {
    flex: 1;
}


.em-details-em-info-column-item-nav {
    font-weight: 900;
    flex: 1;
}

.em-details-subarea {
    margin-bottom: 20px;
}

.em-details-area-compound {
    display: flex;
    margin-bottom: 20px;
}

.em-details-area-compound>img {
    height: 200px;
    width: 300px;
    object-fit: contain;
    margin-right: 20px;
}

.em-details-area {
    padding: 20px;
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.em-table-area {
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px
}

.em-table-area>h2 {
    padding: 10px;
}
</style>