<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiMolecule,
    mdiPlus,
} from '@mdi/js'
import InsertCompoundModal from '@/components/InsertCompoundModal.vue';


const showInsertCompoundModal = ref(false);
const isDetailsShown = ref(false);
const compoundsList = ref();
const experimentsListToSynthesisTargetCompound = ref();
const samplesListContainCompound = ref();
const currentCompoundDetails = ref();
const isLoadingList = ref(false);
const isLoadingDetails = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))

const setCurrentCompoundDetails = async (compoundId: number) => {
    isLoadingDetails.value = true;
    try {
        await getCompoundInfo(compoundId);
        await getExperimentsListToSynthesisTargetCompound(compoundId);
        await getSamplesListContainCompound(compoundId);
        isDetailsShown.value = true;
    } catch (e) {
        // isDetailsShown.value = 'error';
        isDetailsShown.value = true;
        currentCompoundDetails.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "ベンジリデンアセタール", "image_url": "..\/res\/images\/compound1.bmp", "memo": "" }] };
        experimentsListToSynthesisTargetCompound.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_id": 1, "implementation_date": "2024-04-01", "memo": "" }, { "id": 2, "created_at": "2024-04-01", "updated_at": "2024-04-01", "title": "ベンジリデンアセタール化", "compound_id": 1, "implementation_date": "2024-04-01", "memo": "" }] };
        samplesListContainCompound.value = { "error": false, "errorMessage": "", "content": [{ "current_weight": 0, "id": 1, "label": "KS001 crude", "preparation_date": "2024-04-01", "sample_state": "mixture" }, { "current_weight": 0, "id": 3, "label": "KS001 p2", "preparation_date": "2024-04-02", "sample_state": "pure" }, { "current_weight": 0, "id": 4, "label": "KS002 crude", "preparation_date": "2024-04-04", "sample_state": "mixture" }, { "current_weight": 3.21, "id": 6, "label": "KS002 p2", "preparation_date": "2024-04-04", "sample_state": "pure" }] }


    }
    isLoadingDetails.value = false;
}


const getAllCompoundsList = async () => {
    isLoadingList.value = true;
    try {
        compoundsList.value = await fetch('./api_lms/getAllCompoundsList.php')
            .then(function (res) {
                return res.json()
            })
    } catch {
        compoundsList.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "ベンジリデンアセタール", "image_url": "..\/res\/images\/compound1.bmp", "memo": "" }, { "id": 2, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "トシラート", "image_url": "..\/res\/images\/compound2.bmp", "memo": "" }, { "id": 3, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "エポキシド", "image_url": "..\/res\/images\/compound3.bmp", "memo": "" }, { "id": 10, "created_at": "2024-05-06", "updated_at": "2024-05-06", "name": "化合物名", "image_url": "化合物名_2tbqok79dkcgc8wgw00okkwogwsocoscko0ksgwkc8gs4ogg", "memo": "shirew" }, { "id": 11, "created_at": "2024-05-06", "updated_at": "2024-05-06", "name": "化合物名", "image_url": "化合物名_65qb12hfpm8s0g0gwscswkgw8sso4wg0wcs8w0ckckwswc84", "memo": "shirew" }, { "id": 12, "created_at": "2024-05-07", "updated_at": "2024-05-07", "name": "klhih", "image_url": "klhih_4hzoaizftc4kcss4g8sg0ssg4ok0k0808cgc0008s4w8cw8s", "memo": "fy" }] }
    }
    isLoadingList.value = false;
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

onMounted(() => {
    getAllCompoundsList();
})
</script>

<template>
    <div class="main-area">
        <div class="cm-side-bar">
            <div class="cm-header">
                <div class="cm-header-left">
                    <p>化合物リスト</p>
                </div>
                <div class="cm-header-right">
                    <button class="btn-default btn-small">
                        <v-icon @click="showInsertCompoundModal = true" :icon="mdiPlus" size=20
                            color="rgb(95, 95, 95)"></v-icon>
                    </button>
                </div>
            </div>
            <div class="cm-compounds-list">
                <div v-if="isLoadingList || compoundsList == null">
                    Loading...
                </div>
                <div v-else-if="compoundsList['error']">
                    データ取得に失敗しました。
                </div>
                <div v-else-if="compoundsList['content'].length == 0">
                    登録されている化合物がありません。
                </div>
                <div v-else v-for="compound in compoundsList['content']" class="cm-item"
                    @click="setCurrentCompoundDetails(compound['id'])">
                    <img v-bind:src="compound['image_url']">
                    <div>
                        <p>{{ compound['name'] }}</p>
                        <small>重量</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="cm-main-content">
            <div class="cm-main-content-default" v-if="!isDetailsShown">
                <v-icon :icon=mdiMolecule size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <div v-if="isDetailsShown">
                <div class="cm-header">
                    <div class="cm-header-left">
                        <p>詳細画面</p>
                    </div>
                    <div class="cm-header-right">
                    </div>
                </div>
                <div v-if="isLoadingDetails">
                    Loading...
                </div>
                <div v-else-if="currentCompoundDetails == null || currentCompoundDetails['error']">
                    データ取得に失敗しました。
                </div>
                <div v-else class="cm-details-area">
                    <div class="cm-details-subarea">
                        <div class="cm-details-cm-info">
                            <img v-bind:src="currentCompoundDetails['content'][0]['image_url']">
                            <div>
                                <div>
                                    <div class="cm-details-cm-info-item-nav">化合物ID</div>
                                    {{ currentCompoundDetails['content'][0]['id'] }}
                                </div>
                                <div>
                                    <div class="cm-details-cm-info-item-nav">化合物名</div>
                                    {{ currentCompoundDetails['content'][0]['name'] }}
                                </div>
                                <div>
                                    <div class="cm-details-cm-info-item-nav">現在の総重量</div>
                                    準備中
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
                            <table v-else style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <th width="90">実験ID</th>
                                        <th width="110">実施日</th>
                                        <th>実験題目</th>
                                    </tr>
                                    <tr v-for="experiment in experimentsListToSynthesisTargetCompound['content']">
                                        <td>
                                            <span>KS</span>{{ experiment['id'].toString().padStart(3, '0') }}
                                        </td>
                                        <td>
                                            {{ experiment['implementation_date'] }}
                                        </td>
                                        <td>
                                            <span>準備中</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="cm-details-subarea">
                        <div class="cm-table-area">
                            <h2>この化合物を使用する実験</h2>
                            <div
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
                            </table>
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
                            <table v-else style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <th width="110">サンプルID</th>
                                        <th width="110">保存日</th>
                                        <th>ラベル名</th>
                                        <th>現在の重量</th>
                                        <th>状態</th>
                                    </tr>
                                    <tr v-for="sample in samplesListContainCompound['content']">
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
        </div>
    </div>
    <Teleport to="body">
        <InsertCompoundModal :show="showInsertCompoundModal" @close="showInsertCompoundModal = false" @submit="async () => {
                            await sleep(0.5);
                            isLoadingList = true;
                            await getAllCompoundsList();
                            isLoadingList = false;
                            isDetailsShown = false;
                            showInsertCompoundModal = false;
                        }">
        </InsertCompoundModal>
    </Teleport>
</template>

<style scoped>
.main-area {
    display: flex;
    width: 97.5vw;
}

.cm-side-bar {
    width: 30vw;
    height: calc(100vh - 35px);
    border-right: 1px solid rgb(200, 200, 200);
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
}

.cm-details-cm-info-item-nav {
    font-weight: 900;
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
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px
}

.cm-table-area>h2 {
    padding: 10px;
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

tr:nth-child(even) {
    background-color: #FFFFFF;
}
</style>