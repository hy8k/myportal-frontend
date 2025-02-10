<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();

const experimentsList = ref();
const samplesListOfExperiment = ref();
const currentExperimentDetails = ref();
const isLoadingDetails = ref(false);


const setCurrentExperimentDetails = async (experimentId: number) => {
    isLoadingDetails.value = true;
    try {
        await getExperimentInfo(experimentId);
        await getSamplesListOfExperiment(experimentId);
    } catch (e) {
        // currentMode.value = 'error';
        currentExperimentDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "title": "ベンジリデンアセタール化", "implementation_date": "2024-04-01", "memo": "テスト用のデータを表示中", "compound_name": "ベンジリデンアセタール" }] };
        samplesListOfExperiment.value = { "error": false, "errorMessage": "", "content": [{ "id": 2, "compound_id": 1, "state_id": 1, "current_weight": 0, "label": "KS002 crude", "memo": "", "preparation_date": "2024-04-04", "compound_name": "ベンジリデンアセタール", "sample_state": "mixture" }, { "id": 2, "compound_id": null, "state_id": 3, "current_weight": 1.233, "label": "KS002 p1 bypro", "memo": "", "preparation_date": "2024-04-04", "compound_name": null, "sample_state": "pure" }, { "id": 2, "compound_id": 1, "state_id": 3, "current_weight": 3.21, "label": "KS002 p2", "memo": "", "preparation_date": "2024-04-04", "compound_name": "ベンジリデンアセタール", "sample_state": "pure" }] }

    }
    isLoadingDetails.value = false;
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

onMounted(() => setCurrentExperimentDetails(Number(route.params.id)));
watch(() => route.params.id, async newId => setCurrentExperimentDetails(Number(newId)));
</script>

<template>
    <div class="em-details-wrapper">
        <div class="em-header">
            <div class="em-header-left">
                <p>詳細画面</p>
            </div>
            <div class="em-header-right">
                <button class="btn-default btn-small">
                    <p>コピーして実験データを作成</p>
                </button>
            </div>
        </div>
        <div v-if="isLoadingDetails">
            Loading...
        </div>
        <div v-else-if="currentExperimentDetails == null">
            <p>データ取得に失敗しました。</p>
            <p>currentExperimentDetailsはnullです。</p>
        </div>
        <div v-else-if="currentExperimentDetails['error']">
            <p>データ取得に失敗しました。</p>
            <p>{{ currentExperimentDetails['errorMessage'] }}</p>
        </div>
        <div v-else-if="currentExperimentDetails['content'].length == 0">
            <p>指定されたIDの実験データはありません。</p>
            <p>指定されたID：{{ $route.params.id }}</p>
        </div>
        <div v-else class="em-details-area">
            <div class="em-details-subarea">
                <div class="em-details-em-info">
                    <div class="em-details-em-info-column">
                        <!-- <p>{{ currentExperimentDetails['compound'][0]['compound_name'] }}</p> -->
                        <div class="em-details-em-info-column-item">
                            <div class="em-details-em-info-column-item-nav">
                                実験ID
                            </div>
                            KS{{ currentExperimentDetails['content'][0]['id'].toString().padStart(3, '0') }}
                        </div>
                        <div class="em-details-em-info-column-item">
                            <div class="em-details-em-info-column-item-nav">
                                実験題目
                            </div>
                            {{ currentExperimentDetails['content'][0]['title'] }}
                        </div>

                    </div>
                    <div class="em-details-em-info-column">
                        <div class="em-details-em-info-column-item">
                            <div class="em-details-em-info-column-item-nav">
                                目的化合物
                            </div>
                            {{ currentExperimentDetails['content'][0]['compound_name'] }}
                        </div>
                        <div class="em-details-em-info-column-item">
                            <div class="em-details-em-info-column-item-nav">
                                実験実施日
                            </div>
                            {{ currentExperimentDetails['content'][0]['implementation_date'] }}
                        </div>
                    </div>
                    <div class="em-details-em-info-column">
                        <div class="em-details-em-info-column-item"
                            v-if="currentExperimentDetails['content'][0]['memo'] == ''">
                            <div class="em-details-em-info-column-item-nav">
                                メモ
                            </div>
                            なし
                        </div>
                        <div class="em-details-em-info-column-item" v-else>
                            <div class="em-details-em-info-column-item-nav">
                                メモ
                            </div>
                            {{ currentExperimentDetails['content'][0]['memo'] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="em-details-subarea">
                <div class="em-table-area">
                    <h2>実験サンプル</h2>
                    <div v-if="samplesListOfExperiment == null || samplesListOfExperiment['error']">
                        　データ取得に失敗しました。
                    </div>
                    <div v-else-if="samplesListOfExperiment['content'].length == 0">
                        　該当するデータがありません。
                    </div>
                    <table v-else style="width: 100%;table-layout: fixed;">
                        <tbody>
                            <tr>
                                <th width="50">サンプルID</th>
                                <th width="50">保存日</th>
                                <th width="150">ラベル名</th>
                                <th width="50">現在の重量</th>
                                <th width="50">状態</th>
                            </tr>
                            <tr v-for="sample in samplesListOfExperiment['content']">
                                <td>
                                    {{ sample['id'] }}
                                </td>
                                <td>
                                    {{ sample['preparation_date'] }}
                                </td>
                                <td>
                                    {{ sample['label'] }}
                                </td>
                                <td>
                                    {{ sample['current_weight'] + 'g' }}
                                </td>
                                <td>
                                    {{ sample['sample_state'] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.em-details-wrapper {
    width: 67.5vw;
    background-color: white;
    position: absolute;
    height: calc(100vh - 35px);
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
    width: 67.5vw;
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