<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
const props = defineProps({
    show: Boolean
})
const loading = ref(false);
const compoundName = ref('');
const compoundImage = ref('');
const compoundMemo = ref('');
const isCompoundFormValid = ref(false);
const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))


const onImageUploaded = (files: File[]) => {
    if (files.length > 0) {
        const file = files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener(
            "load",
            () => {
                // 画像ファイルを base64 文字列に変換します
                compoundImage.value = fileReader.result as string;
            },
            false,
        );
        fileReader.readAsDataURL(file);
    } else {
        compoundImage.value = '';
    }
}

const insertCompound = async (name: string, image: string, memo: string) => {
    loading.value =true;
    const data = {
        'compoundName': name,
        'compoundImage': image,
        'compoundMemo': memo
    };

    const response = await fetch('./api_lms/insertCompound.php', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(res) {
        return res.json();
    });

    if (response['error'] == false) {
        await sleep(0.5);

        compoundName.value = '';
        compoundImage.value = '';
        compoundMemo.value = '';
        loading.value = false;
    }
}
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-main">
                    <div class="modal-header">
                        <h3>化合物データ作成</h3>
                    </div>
                    <v-form v-model="isCompoundFormValid" validate-on="blur"
                        @submit.prevent="insertCompound(compoundName, compoundImage, compoundMemo)">
                        <div class="modal-body">
                            <v-text-field class="form-item" label="化合物名" v-model="compoundName"
                                :rules="[(v: string) => !!v || '入力してください。']" required></v-text-field>
                            <v-textarea class="form-item" label="メモ" rows="2" no-resize
                                v-model="compoundMemo"></v-textarea>
                            <v-file-input class="form-item" label="化合物の構造式（BMPファイルのみ）"
                                @update:model-value="onImageUploaded" accept="image/bmp"></v-file-input>
                            <p>プレビュー</p>
                            <img v-if="compoundImage == ''"
                                src="../assets/images/image-off.png" width="70">
                            <img v-else :src="compoundImage" width="100">
                        </div>
                        <div class="modal-footer">
                            <v-btn class="btn-primary modal-default-btn" type="submit" :disabled="!isCompoundFormValid" :loading="loading"
                                @submit="$emit('submit')">作成する</v-btn>
                            <v-btn class="btn-default modal-default-btn" @click="$emit('close')">キャンセル</v-btn>
                        </div>
                    </v-form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
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
    height: 42vw;
    margin: auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-main {
    flex: 1;
}

.modal-footer {
    flex: 1;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.form-item {
    padding: 5px 0;
}

.modal-body input {
    width: 100%;
}

.modal-default-btn {
    float: right;
    margin-left: 10px;
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