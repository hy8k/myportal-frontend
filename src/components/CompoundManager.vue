<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import {
    mdiMolecule,
    mdiPlus,
} from '@mdi/js'
import InsertCompoundModal from '@/components/InsertCompoundModal.vue';


const showInsertCompoundModal = ref(false);
const compoundsList = ref();
const isLoadingList = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))

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
                            ></v-icon>
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
                <router-link :to="('/lab-management/compound/' + compound['id']).toString()" v-else
                    v-for=" compound in compoundsList['content']" class="cm-item">
                    <img v-bind:src="compound['image_url']">
                    <div>
                        <p>{{ compound['name'] }}</p>
                    </div>
                </router-link>
            </div>
        </div>  
        <div class="cm-main-content">
            <div class="cm-main-content-default">
                <v-icon :icon=mdiMolecule size="40" color="rgb(174, 174, 174)"></v-icon>
            </div>
            <router-view />
        </div>
        <Teleport to="body">
            <InsertCompoundModal :show="showInsertCompoundModal" @close="showInsertCompoundModal = false" @submit="async () => {
                            await sleep(0.5);
                            isLoadingList = true;
                            await getAllCompoundsList();
                            isLoadingList = false;
                            showInsertCompoundModal = false;
                        }">
            </InsertCompoundModal>
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
    text-decoration: none;
    color: black;
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
    position: relative;
}

.cm-main-content-default {
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
</style>