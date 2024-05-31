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
const isLoadingList = ref(false);

const setCurrentSampleDetails = async (sampleId: number) => {
    try {
        currentSampleDetails.value = await fetch('./api_lms/getSampleInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'sampleId': sampleId
            })
        }).then(function (res) {
            return res.json();
        })
        currentMode.value = 'detail';
    } catch (e) {
        // currentMode.value = 'error';
        currentSampleDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS001 crude", "memo": "", "preparation_date": "2024-04-01" }] };

        currentMode.value = 'detail';
        console.log(e);
    }
}


const getAllSamples = async () => {
    try {
        samplesList.value = await fetch('./api_lms/getAllSamplesList.php')
            .then(function (res) {
                return res.json()
            })
        samplesList.value.reverse();
    } catch {
        samplesList.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS001 crude", "memo": "", "preparation_date": "2024-04-01" }, { "id": 2, "created_at": "2024-04-02", "updated_at": "2024-04-02", "compound_id": null, "state_id": 2, "current_weight": 0, "label": "KS001 p1 bypro", "memo": "", "preparation_date": "2024-04-02" }, { "id": 3, "created_at": "2024-04-02", "updated_at": "2024-04-02", "compound_id": 1, "state_id": 3, "current_weight": 0, "label": "KS001 p2", "memo": "", "preparation_date": "2024-04-02" }, { "id": 4, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS002 crude", "memo": "", "preparation_date": "2024-04-04" }, { "id": 5, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": null, "state_id": 3, "current_weight": 1.233, "label": "KS002 p1 bypro", "memo": "", "preparation_date": "2024-04-04" }, { "id": 6, "created_at": "2024-04-04", "updated_at": "2024-04-04", "compound_id": 1, "state_id": 3, "current_weight": 3.21, "label": "KS002 p2", "memo": "", "preparation_date": "2024-04-04" }, { "id": 7, "created_at": "2024-04-05", "updated_at": "2024-04-05", "compound_id": 2, "state_id": 1, "current_weight": 2.324, "label": "KS003 crude", "memo": "", "preparation_date": "2024-04-05" }] };

        samplesList.value.reverse();
    }
}

onMounted(() => {
    getAllSamples();
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
            <div class="sm-samples-list">
                <div v-if="isLoadingList || samplesList == null">
                    Loading...
                </div>
                <div v-else-if="samplesList['error']">
                    データ取得に失敗しました。
                </div>
                <div v-else v-for="sample in samplesList['content']" class="sm-item"
                    @click="setCurrentSampleDetails(sample['id'])">
                    <div>
                        <p> {{ sample['label'] }}</p>
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
                    <div class="sm-details-subarea">
                        <div class="sm-details-sm-info">
                            <!-- <p>{{ currentSampleDetails['compound'][0]['compound_name'] }}</p> -->
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    サンプルID
                                </div>
                                {{ currentSampleDetails['content'][0]['id'] }}
                            </div>
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    ラベル
                                </div>
                                {{ currentSampleDetails['content'][0]['label'] }}
                            </div>

                        </div>
                        <div class="sm-details-sm-info">
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    化合物名
                                </div>
                                {{ currentSampleDetails['content'][0]['compound_name'] }}
                            </div>
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    状態
                                </div>
                                {{ currentSampleDetails['content'][0]['sample_state'] }}
                            </div>
                        </div>
                        <div class="sm-details-sm-info">
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    現在の重量
                                </div>
                                {{ currentSampleDetails['content'][0]['current_weight'] }}g
                            </div>
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    保存日
                                </div>
                                {{  currentSampleDetails['content'][0]['preparation_date'] }}
                            </div>
                        </div>
                        <div class="sm-details-sm-info">
                            <div class="sm-details-sm-info-item">
                                <div class="sm-details-sm-info-item-nav">
                                    メモ
                                </div>
                                <div v-if="currentSampleDetails['content'][0]['memo'] == ''">
                                    なし
                                </div>
                                <div v-else>
                                    {{ currentSampleDetails['content'][0]['memo'] }}
                                </div>
                            </div>
                        </div>
                    </div>
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