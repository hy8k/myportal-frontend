<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
    show: Boolean
})
const newMemoTitle = ref();
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>メモタイトル変更</h3>
                </div>

                <div class="modal-body">
                    <v-text-field label="変更後のタイトル" v-model="newMemoTitle"></v-text-field>
                </div>

                <div class="modal-footer">
                    <v-btn class="btn-primary modal-default-btn" @click="{
                        $emit('rename', newMemoTitle);
                        newMemoTitle = '';
                    }">変更する</v-btn>
                    <v-btn class="btn-default modal-default-btn" @click="$emit('close')">キャンセル</v-btn>
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
    width: 350px;
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