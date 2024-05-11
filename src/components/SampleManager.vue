<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiFileQuestion,
    mdiTestTube,
    mdiBottleTonic,
    mdiPlus,
    mdiMagnify
} from '@mdi/js'
import InsertSampleModal from '@/components/InsertSampleModal.vue';

const showInsertSampleModal = ref(false);
const currentMode = ref("");
const samplesList = ref();
const currentSampleDetails = ref()

const setCurrentSampleDetails = async (compoundId: number) => {
    try {
        currentSampleDetails.value = await fetch('./api/getSampleDetails.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'compoundId': compoundId
            })
        }).then(function (res) {
            return res.json();
        })
        currentMode.value = 'detail';
    } catch (e) {
        // currentMode.value = 'error';
        currentMode.value = 'detail';
        console.log(e);
    }
}


const getSamplesData = async () => {
    try {
        samplesList.value = await fetch('./api/getAllSamples.php')
            .then(function (res) {
                return res.json()
            })
        samplesList.value.reverse();
    } catch {
        samplesList.value = [{ "sample_id": 1, "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS001 crude", "timestamp": "2024-04-01" }, { "sample_id": 2, "compound_id": null, "state_id": 2, "current_weight": 0, "label": "KS001 p1 bypro", "timestamp": "2024-04-02" }, { "sample_id": 3, "compound_id": 1, "state_id": 3, "current_weight": 0, "label": "KS001 p2", "timestamp": "2024-04-02" }, { "sample_id": 4, "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS002 crude", "timestamp": "2024-04-04" }, { "sample_id": 5, "compound_id": null, "state_id": 3, "current_weight": 1.233, "label": "KS002 p1 bypro", "timestamp": "2024-04-04" }, { "sample_id": 6, "compound_id": 1, "state_id": 3, "current_weight": 3.21, "label": "KS002 p2", "timestamp": "2024-04-04" }, { "sample_id": 7, "compound_id": 2, "state_id": 1, "current_weight": 2.324, "label": "KS003 crude", "timestamp": "2024-04-05" }]
        samplesList.value.reverse();
    }
}

onMounted(() => {
    getSamplesData();
})
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
            <div class="sm-compounds-list">
                <div v-for="compound in samplesList" class="sm-item"
                    @click="setCurrentSampleDetails(compound['compound_id'])">
                    <div>
                        <p>{{ compound['label'] }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="sm-main-content">
            <div class="sm-main-content-default" v-if="currentMode == ''">
                <v-icon :icon=mdiBottleTonic size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <div v-if="currentMode == 'detail'">
                <div class="sm-header">
                    <div class="sm-header-left">
                        <p>詳細画面</p>
                    </div>
                    <div class="sm-header-right">
                    </div>
                </div>
                <div class="sm-details-area">
                    <div class="sm-details-area-compound">
                        <img v-bind:src="currentSampleDetails['compound'][0]['compound_image_url']">
                        <!-- <p>{{ currentSampleDetails['compound'][0]['compound_name'] }}</p> -->
                        <table>
                            <tbody>
                                <tr>
                                    <td width="150">化合物ID</td>
                                    <td width="250">{{ currentSampleDetails['compound'][0]['compound_id'] }}</td>
                                </tr>
                                <tr>
                                    <td>化合物名</td>
                                    <td>{{ currentSampleDetails['compound'][0]['compound_name'] }}</td>
                                </tr>
                                <tr>
                                    <td>現在の総重量</td>
                                    <td>準備中</td>
                                </tr>
                                <tr>
                                    <td>総使用量</td>
                                    <td>準備中</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h2>関連する実験</h2>
                    <h2>関連するサンプル</h2>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <InsertSampleModal :show="showInsertSampleModal" @close="showInsertSampleModal = false" @create="(memoTitle: string) => {
                            // saveMemo(memoTitle, '');
                            showInsertSampleModal = false;
                        }">
        </InsertSampleModal>
    </Teleport>
</template>

<style scoped>
.main-area {
    display: flex;
    width: 97.5vw;
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

.sm-compounds-list {
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
}

.sm-item:hover {
    background-color: rgb(235, 235, 235);
}

.sm-main-content {
    width: 67.5vw;
}

.sm-main-content-default {
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
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
    padding: 15px;
}
</style>