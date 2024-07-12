<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();

const experimentsListToSynthesisTargetCompound = ref();
const samplesListContainCompound = ref();
const currentCompoundDetails = ref();
const isLoadingDetails = ref(false);

const setCurrentCompoundDetails = async (compoundId: number) => {
    isLoadingDetails.value = true;
    try {
        await getCompoundInfo(compoundId);
        await getExperimentsListToSynthesisTargetCompound(compoundId);
        await getSamplesListContainCompound(compoundId);
    } catch (e) {
        // isDetailsShown.value = 'error';
        currentCompoundDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "ベンジリデンアセタール", "image_url": "..\/res\/images\/compound1.bmp", "memo": "テスト用のデータを表示中" }] };
        experimentsListToSynthesisTargetCompound.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_id": 1, "implementation_date": "2024-04-01", "memo": "" }, { "id": 2, "created_at": "2024-04-01", "updated_at": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_id": 1, "implementation_date": "2024-04-01", "memo": "" }] };
        samplesListContainCompound.value = { "error": false, "errorMessage": "", "content": [{ "current_weight": 0, "id": 1, "label": "KS001 crude", "preparation_date": "2024-04-01", "sample_state": "mixture" }, { "current_weight": 0, "id": 3, "label": "KS001 p2", "preparation_date": "2024-04-02", "sample_state": "pure" }, { "current_weight": 0, "id": 4, "label": "KS002 crude", "preparation_date": "2024-04-04", "sample_state": "mixture" }, { "current_weight": 3.21, "id": 6, "label": "KS002 p2", "preparation_date": "2024-04-04", "sample_state": "pure" }] }
    }
    isLoadingDetails.value = false;
}

const getCompoundInfo = async (compoundId: number) => {
    currentCompoundDetails.value = await fetch('./api_lms/getCompoundInfo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'compoundId': compoundId
        })
    }).then(function (res) {
        return res.json();
    }).catch(function () {
        throw new Error;
    })
}

const getExperimentsListToSynthesisTargetCompound = async (compoundId: number) => {
    experimentsListToSynthesisTargetCompound.value = await fetch('./api_lms/getExperimentsListToSynthesisTargetCompound.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'compoundId': compoundId
        })
    }).then(function (res) {
        return res.json();
    }).catch(function () {
        throw new Error;
    })
}

const getSamplesListContainCompound = async (compoundId: number) => {
    samplesListContainCompound.value = await fetch('./api_lms/getSamplesListContainCompound.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'compoundId': compoundId
        })
    }).then(function (res) {
        return res.json();
    }).catch(function () {
        throw new Error;
    })
}

const navigateToLink = (id: string, to: string) => {
    const link = '/myportal/#/lab-management/' + to + '/' + id;
    window.location.href = link;
}

onMounted(() => setCurrentCompoundDetails(Number(route.params.id)));
watch(() => route.params.id, async newId => setCurrentCompoundDetails(Number(newId)));
</script>

<template>
    <div class="cm-details-wrapper">
        <div class="cm-header">
            <div class="cm-header-left">
                <p>詳細画面</p>
            </div>
            <div class="cm-header-right">
                <button class="btn-default btn-small">
                    <p>実験データ作成</p>
                </button>
            </div>
        </div>
        <div v-if="isLoadingDetails">
            Loading...
        </div>
        <div v-else-if="currentCompoundDetails == null">
            <p>データ取得に失敗しました。</p>
            <p>currentCompoundDetailsはnullです。</p>
        </div>
        <div v-else-if="currentCompoundDetails['error']">
            <p>データ取得に失敗しました。</p>
            <p>{{ currentCompoundDetails['errorMessage'] }}</p>
        </div>
        <div v-else-if="currentCompoundDetails['content'].length == 0">
            <p>指定されたIDの化合物データはありません。</p>
            <p>指定されたID：{{ $route.params.id }}</p>
        </div>
        <div v-else class="cm-details-area">
            <div class="cm-details-subarea">
                <div class="cm-details-cm-info">
                    <img v-bind:src="currentCompoundDetails['content'][0]['image_url']">
                    <div class="cm-details-cm-info-right">
                        <div class="cm-details-cm-info-column">
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">化合物ID</div>
                                <span>{{ currentCompoundDetails['content'][0]['id'] }}</span>
                            </div>
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">化合物名</div>
                                <span>{{ currentCompoundDetails['content'][0]['name'] }}</span>
                            </div>
                        </div>
                        <div class="cm-details-cm-info-column">
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">重量(pure)</div>
                                <p>{{
            currentCompoundDetails['content'][0]['total_amount_pure'] ===
                null ?
                0 : currentCompoundDetails['content'][0]['total_amount_pure'] }}g</p>
                            </div>
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">重量(semi-pure)</div>
                                <p>{{
            currentCompoundDetails['content'][0]['total_amount_semi_pure'] ===
                null ?
                0 : currentCompoundDetails['content'][0]['total_amount_semi_pure'] }}g</p>
                            </div>
                        </div>
                        <div class="cm-details-cm-info-column">
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">重量(mixture)</div>
                                <p>{{
            currentCompoundDetails['content'][0]['total_amount_mixture'] ===
                null ?
                0 : currentCompoundDetails['content'][0]['total_amount_mixture'] }}g</p>
                            </div>
                            <div class="cm-details-cm-info-column-item">
                                <div class="cm-details-cm-info-item-nav">メモ</div>
                                <div v-if="currentCompoundDetails['content'][0]['memo'] == ''">
                                    <span>なし</span>
                                </div>
                                <div v-else>
                                    <span>{{ currentCompoundDetails['content'][0]['memo'] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cm-details-subarea">
                <div class="cm-table-area">
                    <h2>この化合物を合成する実験</h2>
                    <div
                        v-if="experimentsListToSynthesisTargetCompound['error'] || experimentsListToSynthesisTargetCompound['content'] == null">
                        　データ取得に失敗しました。
                    </div>
                    <div v-else-if="samplesListContainCompound['content'].length == 0">
                        　該当するデータがありません。
                    </div>
                    <table v-else style="width: 100%;table-layout: fixed;">
                        <tbody>
                            <tr>
                                <th width="50">実験ID</th>
                                <th width="50">実施日</th>
                                <th width="220">実験題目</th>
                            </tr>
                            <tr v-for="experiment in experimentsListToSynthesisTargetCompound['content']" class="cm-table-row"
                                :key="experiment['id']" @click="navigateToLink(experiment['id'], 'experiment')">
                                <td>
                                    <span>KS</span>{{ experiment['id'].toString().padStart(3, '0') }}
                                </td>
                                <td>
                                    {{ experiment['implementation_date'] }}
                                </td>
                                <td>
                                    <span>{{ experiment['title'] }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="cm-details-subarea">
                <div class="cm-table-area">
                    <h2>この化合物を使用する実験</h2>
                    　準備中
                    <!-- <div
                                v-if="experimentsListToSynthesisTargetCompound == null || experimentsListToSynthesisTargetCompound['error']">
                                　データ取得に失敗しました。
                            </div>
                            <div v-else-if="experimentsListToSynthesisTargetCompound['content'].length == 0">
                                　該当するデータがありません。
                            </div>
                            <table v-else style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <th width="90">実験ID</th>
                                        <th width="110">実施日</th>
                                        <th>実験題目</th>
                                    </tr>
                                    <tr v-for="experiment in experimentsListToSynthesisTargetCompound['content']">
                                        <td>
                                            KS{{ experiment['id'].toString().padStart(3, '0') }}
                                        </td>
                                        <td>
                                            {{ experiment['implementation_date'] }}
                                        </td>
                                        <td>
                                            <span>準備中</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table> -->
                </div>
            </div>
            <div class="cm-details-subarea">
                <div class="cm-table-area">
                    <h2>この化合物を含むサンプル</h2>
                    <div v-if="samplesListContainCompound == null || samplesListContainCompound['error']">
                        　データ取得に失敗しました。
                    </div>
                    <div v-else-if="samplesListContainCompound['content'].length == 0">
                        　該当するデータがありません。
                    </div>
                    <table v-else style="width: 100%;table-layout: fixed;">
                        <tbody>
                            <tr>
                                <th width="40">サンプルID</th>
                                <th width="50">保存日</th>
                                <th width="150">ラベル名</th>
                                <th width="50">現在の重量</th>
                                <th width="50">状態</th>
                            </tr>
                            <tr class="cm-table-row" v-for="sample in samplesListContainCompound['content']"
                                :key="sample['id']" @click="navigateToLink(sample['id'], 'sample')">
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
.cm-details-wrapper {
    width: 67.5vw;
    background-color: white;
    position: absolute;
    height: calc(100vh - 35px);
}

.cm-header {
    display: flex;
    height: 40px;
    padding: 0 15px;
    color: white;
    background-color: rgb(199, 50, 50);
}

.cm-header-left {
    display: flex;
    align-items: center;
    flex: 1;
}

.cm-header-right {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.cm-header-right button {
    margin-left: 7px;
}

.cm-compounds-list {
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.cm-item {
    display: flex;
    padding: 10px;
    height: 80px;
    border-bottom: 1px solid rgb(200, 200, 200);
    cursor: pointer;
    align-items: center;
}

.cm-item:hover {
    background-color: rgb(235, 235, 235);
}

.cm-item>img {
    height: 75px;
    width: 120px;
    object-fit: contain;
    margin-right: 10px;
}

.cm-main-content {
    width: 67.5vw;
}

.cm-main-content-default {
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
}

.cm-details-subarea {
    margin-bottom: 20px;
}

.cm-details-cm-info {
    display: flex;
    padding: 10px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
}

.cm-details-cm-info-right {
    flex: 1;
}

.cm-details-cm-info-item-nav {
    font-weight: 900;
    flex: 1;
}

.cm-details-cm-info>img {
    height: 170px;
    width: 300px;
    object-fit: contain;
    margin-right: 20px;
}

.cm-details-area {
    padding: 20px;
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.cm-details-cm-info-column {
    display: flex;
    margin-bottom: 5px;
}

.cm-details-cm-info-column-item {
    flex: 1;
}

.cm-details-ex-list1 {
    width: 50%;
}

.cm-details-ex-list1-item {
    display: flex;
    border-bottom: 1px solid rgb(200, 200, 200);
    border-top: 1px solid rgb(200, 200, 200);
}

.cm-details-ex-list1-item>p {
    margin-right: 50px;
}

.cm-table-area {
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
}

.cm-table-area>h2 {
    padding: 10px;
}

.cm-table-row:hover {
    background-color: rgb(235, 235, 235);
    cursor: pointer;
}


table {
    border: none
}

th {
    border: none;
}

td {
    border-left: none;
    border-right: none;
    border-bottom: none;
}

tr {
    background-color: #FFFFFF;
}
</style>