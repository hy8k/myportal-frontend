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

const showInsertExperimentModal = ref(false);
const currentMode = ref("");
const experimentsList = ref();
const currentExperimentDetails = ref();
const isLoadingList = ref(false);

const setCurrentExperimentDetails = async (experimentId: number) => {
    try {
        currentExperimentDetails.value = await fetch('./api/getExperimentDetails.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'experimentId': experimentId
            })
        }).then(function (res) {
            return res.json();
        })
        currentMode.value = 'detail';
    } catch (e) {
        // currentMode.value = 'error';
        currentMode.value = 'detail';
        currentExperimentDetails.value = { "experiment": [{ "experiment_id": 5, "experiment_title": "トシル化", "compound_id": 2, "timestamp": "2024-04-01" }] }

        console.log(e);
    }
}


const getAllExperiments = async () => {
    isLoadingList.value = true;
    try {
        experimentsList.value = await fetch('./api/getAllExperiments.php')
            .then(function (res) {
                return res.json()
            })
        experimentsList.value.reverse();
    } catch {
        experimentsList.value = [{ "experiment_id": 1, "timestamp": "2024-04-01", "compound_id": 1, "compound_name": "ベンジリデンアセタール" }, { "experiment_id": 2, "timestamp": "2024-04-01", "compound_id": 1, "compound_name": "ベンジリデンアセタール" }, { "experiment_id": 3, "timestamp": "2024-04-01", "compound_id": 2, "compound_name": "トシラート" }, { "experiment_id": 4, "timestamp": "2024-04-01", "compound_id": 2, "compound_name": "トシラート" }, { "experiment_id": 5, "timestamp": "2024-04-01", "compound_id": 2, "compound_name": "トシラート" }, { "experiment_id": 6, "timestamp": "2024-04-01", "compound_id": 3, "compound_name": "エポキシド" }, { "experiment_id": 7, "timestamp": "2024-04-01", "compound_id": 3, "compound_name": "エポキシド" }]
        experimentsList.value.reverse();
    }
    isLoadingList.value = false;
}

onMounted(() => {
    getAllExperiments();
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
                        <v-icon @click="showInsertExperimentModal = true" :icon="mdiPlus" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                </div>
            </div>
            <div class="em-experiments-list">
                <div v-if="isLoadingList">
                    Loading...
                </div>
                <div v-else v-for="experiment in experimentsList" class="em-item"
                    @click="setCurrentExperimentDetails(experiment['experiment_id'])">
                    <div>
                        <p>KS{{ experiment['experiment_id'].toString().padStart(3, '0') }} {{
                            experiment['compound_name'] }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="em-main-content">
            <div class="em-main-content-default" v-if="currentMode == ''">
                <v-icon :icon=mdiTestTube size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <div v-if="currentMode == 'detail'">
                <div class="em-header">
                    <div class="em-header-left">
                        <p>詳細画面</p>
                    </div>
                    <div class="em-header-right">
                    </div>
                </div>
                <div class="em-details-area">
                    <div class="em-details-subarea">
                        <div class="em-details-em-info">
                            <!-- <p>{{ currentExperimentDetails['compound'][0]['compound_name'] }}</p> -->
                            <div class="em-details-em-info-item">
                                <div class="em-details-em-info-item-nav">
                                    実験ID
                                </div>
                                KS{{ currentExperimentDetails['experiment'][0]['experiment_id'].toString().padStart(3,
                                '0') }}
                            </div>
                            <div class="em-details-em-info-item">
                                <div class="em-details-em-info-item-nav">
                                    実験題目
                                </div>
                                準備中
                            </div>
                            <div class="em-details-em-info-item">
                                <div class="em-details-em-info-item-nav">
                                    目的化合物
                                </div>
                                準備中
                            </div>
                        </div>
                    </div>
                    <h2>関連するサンプル</h2>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <InsertExperimentModal :show="showInsertExperimentModal" @close="showInsertExperimentModal = false" @create="(memoTitle: string) => {
                            // saveMemo(memoTitle, '');
                            showInsertExperimentModal = false;
                        }">
        </InsertExperimentModal>
    </Teleport>
</template>

<style scoped>
.main-area {
    display: flex;
    width: 96.5vw;
}

.em-side-bar {
    width: 30vw;
    height: calc(100vh - 35px);
    border-right: 2px solid rgb(200, 200, 200);

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
}

.em-item:hover {
    background-color: rgb(235, 235, 235);
}

.em-main-content {
    width: 66.5vw;
}

.em-main-content-default {
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
}

.em-details-em-info {
    display: flex;
}


.em-details-em-info-item {
    flex: 1;
}


.em-details-em-info-item-nav {
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
}
</style>