<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
const props = defineProps({
    show: Boolean
})
import {
    mdiPlus,
} from '@mdi/js'
const experimentNumber = ref('');
const experimentTitle = ref('');
const experimentImplementationDate = ref('');
const experimentMemo = ref('');
const experimentTargetCompoundId = ref('');
const compoundsList = ref();
const isExperimentFormValid = ref(false);
const loading = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))
type Dict = { [key: string]: any };



const insertExperiment = async (eNumber: string, targetCompoundId: string, title: string, implementationDate: string, memo: string) => {
    loading.value = true;
    const data = {
        'experimentNumber': eNumber,
        'experimentTitle': title,
        'experimentImplementationDate': implementationDate,
        'experimentTargetCompoundId': targetCompoundId,
        'experimentMemo': memo
    };



    const response = await fetch('./api_lms/insertExperiment.php', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function (res) {
        return res.json();
    });

    if (response['error'] == false) {
        await sleep(0.5);

        experimentNumber.value = '';
        experimentImplementationDate.value = '';
        experimentTitle.value = '';
        experimentMemo.value = '';
        experimentTargetCompoundId.value = '';
        loading.value = false;
    }
}

const getAllCompoundsList = async () => {
    try {
        compoundsList.value = await fetch('./api_lms/getAllCompoundsList.php')
            .then(function (res) {
                return res.json()
            })
    } catch {
        compoundsList.value = { "error": false, "errorMessage": "", "content": [{ "id": 1, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "ベンジリデンアセタール", "image_url": "..\/res\/images\/compound1.bmp", "memo": "" }, { "id": 2, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "トシラート", "image_url": "..\/res\/images\/compound2.bmp", "memo": "" }, { "id": 3, "created_at": "2024-04-01", "updated_at": "2024-04-01", "name": "エポキシド", "image_url": "..\/res\/images\/compound3.bmp", "memo": "" }, { "id": 10, "created_at": "2024-05-06", "updated_at": "2024-05-06", "name": "化合物名", "image_url": "化合物名_2tbqok79dkcgc8wgw00okkwogwsocoscko0ksgwkc8gs4ogg", "memo": "shirew" }, { "id": 11, "created_at": "2024-05-06", "updated_at": "2024-05-06", "name": "化合物名", "image_url": "化合物名_65qb12hfpm8s0g0gwscswkgw8sso4wg0wcs8w0ckckwswc84", "memo": "shirew" }, { "id": 12, "created_at": "2024-05-07", "updated_at": "2024-05-07", "name": "klhih", "image_url": "klhih_4hzoaizftc4kcss4g8sg0ssg4ok0k0808cgc0008s4w8cw8s", "memo": "fy" }] }
    }
}

onMounted(() => {
    getAllCompoundsList();
})
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>実験データ作成</h3>
                </div>
                <v-form v-model="isExperimentFormValid" validate-on="blur"
                    @submit.prevent="insertExperiment(experimentNumber, experimentTargetCompoundId, experimentTitle, experimentImplementationDate, experimentMemo)">
                    <div class="modal-body">
                        <v-text-field class="form-item" label="実験番号" v-model="experimentNumber"
                            :rules="[(v: string) => !!v || '必須項目です。', (v: string) => !!/^[1-9]\d{0,2}$/.test(v) || '不正な形式です。']"
                            width=145
                            :hint="experimentNumber.length <= 3 ? 'KS' + experimentNumber.padStart(3, '0') : ''"
                            persistent-hint></v-text-field>
                        <v-text-field type="date" class="form-item" label="実験実施日" v-model="experimentImplementationDate"
                            :rules="[(v: string) => !!v || '必須項目です。']" width="180"></v-text-field>
                        <v-select class="form-item" label="目的化合物" :rules="[(v: string) => !!v || '必須項目です。']" width="500"
                            v-model="experimentTargetCompoundId" :items="compoundsList['content']" item-title="name"
                            item-value="id">
                            <template v-slot:item="{ index }">
                                <v-list-item
                                    @click="{ experimentTargetCompoundId = compoundsList['content'][index]['id']; $refs.selectElement }"
                                    :active="experimentTargetCompoundId == compoundsList['content'][index]['id'] ? true : false">
                                    <div style="display: flex; align-items: center;">
                                        <v-img :src="compoundsList['content'][index]['image_url']" height="40" style="flex:1;"></v-img>
                                        <div style="flex:3;">
                                            {{ compoundsList['content'][index]['name'] }}
                                        </div>
                                    </div>
                                </v-list-item>
                            </template>
                        </v-select>
                        <v-text-field class="form-item" label="実験題目" v-model="experimentTitle"
                            :rules="[(v: string) => !!v || '必須項目です。']" width="500"></v-text-field>
                        <v-textarea class="form-item" label="メモ" rows="2" no-resize width="500" v-model="experimentMemo"></v-textarea>
                    </div>
                    <div class="modal-footer">
                        <v-btn class="btn-primary modal-default-btn" type="submit" :disabled="!isExperimentFormValid"
                            :loading="loading" @submit="$emit('submit')">作成する</v-btn>
                        <v-btn class="btn-default modal-default-btn" @click="$emit('close')">キャンセル</v-btn>
                    </div>
                </v-form>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.2s ease;
}

.modal-container {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
}

.modal-body input {
    width: 100%;
}

.modal-default-btn {
    float: right;
    margin-left: 10px;
}

.form-item {
    padding: 5px;
    flex-grow: 0;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>