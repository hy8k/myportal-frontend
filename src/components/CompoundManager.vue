<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiFileQuestion,
    mdiMolecule,
    mdiPlus,
    mdiSleep
} from '@mdi/js'
import InsertCompoundModal from '@/components/InsertCompoundModal.vue';

const showInsertCompoundModal = ref(false);
const currentMode = ref("");
const compoundsList = ref();
const experiemntList1 = ref();
const currentCompoundDetails = ref();
const isLoadingList = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))

const setCurrentCompoundDetail = async (compoundId: number) => {
    try {
        await getCompoundDetails(compoundId);
        await getExperimentDetails1(compoundId);
        currentMode.value = 'detail';
    } catch (e) {
        // currentMode.value = 'error';
        currentMode.value = 'detail';
        currentCompoundDetails.value = { "compound": [{ "compound_id": 2, "compound_name": "テスト2", "compound_image_url": "..\/res\/images\/compound2.bmp" }], "experiments": [{ "experiment_id": 3, "compound_id": 2, "timestamp": "2024-04-01" }, { "experiment_id": 4, "compound_id": 2, "timestamp": "2024-04-01" }, { "experiment_id": 5, "compound_id": 2, "timestamp": "2024-04-01" }], "samples": [{ "sample_id": 7, "compound_id": 2, "state_id": 1, "current_weight": 2.324, "label": "crude", "timestamp": "2024-04-05" }] }
        experiemntList1.value = [
            {
                "experiment_id": 3,
                "compound_id": 2,
                "timestamp": "2024-04-01"
            },
            {
                "experiment_id": 4,
                "compound_id": 2,
                "timestamp": "2024-04-01"
            },
            {
                "experiment_id": 5,
                "compound_id": 2,
                "timestamp": "2024-04-01"
            }
        ]
    }
}


const getAllCompoundsList = async () => {
    isLoadingList.value = true;
    try {
        compoundsList.value = await fetch('./api/getAllCompounds.php')
            .then(function (res) {
                return res.json()
            })
    } catch {
        compoundsList.value = [
            {
                "compound_id": 1,
                "compound_name": "テスト1"
            },
            {
                "compound_id": 2,
                "compound_name": "テスト2"
            },
            {
                "compound_id": 3,
                "compound_name": "テスト3"
            },
            {
                "compound_id": 4,
                "compound_name": "テスト4"
            },
            {
                "compound_id": 5,
                "compound_name": "テスト5"
            }]
    }
    isLoadingList.value = false;
}

const getCompoundDetails = async (compoundId: number) => {
    currentCompoundDetails.value = await fetch('./api/getCompoundDetails.php', {
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

const getExperimentDetails1 = async (compoundId: number) => {
    experiemntList1.value = await fetch('./api/getExperimentsList1.php', {
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
                <div v-if="isLoadingList">
                    Loading...
                </div>
                <div v-else v-for="compound in compoundsList" class="cm-item"
                    @click="setCurrentCompoundDetail(compound['compound_id'])">
                    <img v-bind:src="compound['compound_image_url']">
                    <div>
                        <p>{{ compound['compound_name'] }}</p>
                        <p>重量</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="cm-main-content">
            <div class="cm-main-content-default" v-if="currentMode == ''">
                <v-icon :icon=mdiMolecule size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <div v-if="currentMode == 'detail'">
                <div class="cm-header">
                    <div class="cm-header-left">
                        <p>詳細画面</p>
                    </div>
                    <div class="cm-header-right">
                    </div>
                </div>
                <div class="cm-details-area">
                    <div class="cm-details-subarea">
                        <div class="cm-details-cm-info">
                            <img v-bind:src="currentCompoundDetails['compound'][0]['compound_image_url']">
                            <div>
                                <div>
                                    <div class="cm-details-cm-info-item-nav">化合物ID</div>
                                    {{ currentCompoundDetails['compound'][0]['compound_id'] }}
                                </div>
                                <div>
                                    <div class="cm-details-cm-info-item-nav">化合物名</div>
                                    {{ currentCompoundDetails['compound'][0]['compound_name'] }}
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
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <th width="90">実験ID</th>
                                        <th width="110">実施日</th>
                                        <th>実験題目</th>
                                    </tr>
                                    <tr v-for="experiment in experiemntList1">
                                        <td>
                                            <span>KS</span>{{ experiment['experiment_id'].toString().padStart(3, '0') }}
                                        </td>
                                        <td>
                                            {{ experiment['timestamp'] }}
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
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <th width="90">実験ID</th>
                                        <th width="110">実施日</th>
                                        <th>実験題目</th>
                                    </tr>
                                    <tr v-for="experiment in experiemntList1">
                                        <td>
                                            KS{{ experiment['experiment_id'].toString().padStart(3, '0') }}
                                        </td>
                                        <td>
                                            {{ experiment['timestamp'] }}
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
                        <h2>この化合物を含むサンプル</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <InsertCompoundModal :show="showInsertCompoundModal" @close="showInsertCompoundModal = false" @create="(memoTitle: string) => {
                            // saveMemo(memoTitle, '');
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
    border-right: 1px solid white;

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