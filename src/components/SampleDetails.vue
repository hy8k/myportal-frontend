<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();

const currentSampleDetails = ref()
const isLoadingDetails = ref(false);

const setCurrentSampleDetails = async (sampleId: number) => {
    isLoadingDetails.value = true;
    try {
        await getSampleInfo(sampleId);
    } catch (e) {
        // currentMode.value = 'error';
        currentSampleDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS001 crude", "memo": "テスト用のデータを表示中", "preparation_date": "2024-04-01" }] };
    }
    isLoadingDetails.value = false;
}

const getSampleInfo = async (sampleId: number) => {
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
    }).catch(function () {
        throw new Error;
    })
}

onMounted(() => setCurrentSampleDetails(Number(route.params.id)));
watch(() => route.params.id, async newId => setCurrentSampleDetails(Number(newId)));
</script>

<template>
    <div class="sm-details-wrapper">
        <div class="sm-header">
            <div class="sm-header-left">
                <p>詳細画面</p>
            </div>
            <div class="sm-header-right">
                <button class="btn-default btn-small">
                    <p>使う(実験用途)</p>
                </button>
                <button class="btn-default btn-small">
                    <p>使う(測定・廃棄等)</p>
                </button>
                <button class="btn-default btn-small">
                    <p>精製</p>
                </button>
            </div>
        </div>
        <div v-if="isLoadingDetails">
            Loading...
        </div>
        <div v-else-if="currentSampleDetails == null">
            <p>データ取得に失敗しました。</p>
            <p>currentSampleDetailsはnullです。</p>
        </div>
        <div v-else-if="currentSampleDetails['error']">
            <p>データ取得に失敗しました。</p>
            <p>{{ currentSampleDetails['errorMessage'] }}</p>
        </div>
        <div v-else-if="currentSampleDetails['content'].length == 0">
            <p>指定されたIDのサンプルデータはありません。</p>
            <p>指定されたID：{{ $route.params.id }}</p>
        </div>
        <div v-else class="sm-details-area">
            <div class="sm-details-subarea">
                <div class="sm-details-sm-info">
                    <!-- <p>{{ currentSampleDetails['compound'][0]['compound_name'] }}</p> -->
                    <div class="sm-details-sm-info-column">
                        <div class=" sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                サンプルID
                            </div>
                            {{ currentSampleDetails['content'][0]['id'] }}
                        </div>
                        <div class="sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                ラベル
                            </div>
                            {{ currentSampleDetails['content'][0]['label'] }}
                        </div>
                    </div>
                    <div class="sm-details-sm-info-column">
                        <div class="sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                化合物名
                            </div>
                            {{ currentSampleDetails['content'][0]['compound_name'] }}
                        </div>
                        <div class="sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                状態
                            </div>
                            {{ currentSampleDetails['content'][0]['sample_state'] }}
                        </div>
                    </div>
                    <div class="sm-details-sm-info-column">
                        <div class="sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                現在の重量
                            </div>
                            {{ currentSampleDetails['content'][0]['current_weight'] }}g
                        </div>
                        <div class="sm-details-sm-info-column-item">
                            <div class="sm-details-sm-info-item-nav">
                                保存日
                            </div>
                            {{ currentSampleDetails['content'][0]['preparation_date'] }}
                        </div>
                    </div>
                    <div class="sm-details-sm-info-column">
                        <div class="sm-details-sm-info-column-item">
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
</template>

<style scoped>
.sm-details-wrapper {
    width: 67.5vw;
    background-color: white;
    position: absolute;
    height: calc(100vh - 35px);
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

.sm-details-sm-info-column {
    display: flex;
    margin-bottom: 5px;
}

.sm-details-sm-info {
    padding: 10px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
}

.sm-details-sm-info-column-item {
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