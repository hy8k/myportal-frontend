<script lang="ts">
import { ref } from 'vue';
import { MilkdownProvider } from '@milkdown/vue';
import MilkdownEditor from '@/components/MilkdownEditor.vue';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue';
import FileCreateModal from '@/components/FileCreateModal.vue';
import FileRenameModal from '@/components/FileRenameModal.vue';
import FileDeleteModal from '@/components/FileDeleteModal.vue';
import {
    mdiPlus,
    mdiNoteEdit,
    mdiRename,
    mdiDelete,
    mdiNumeric2BoxMultipleOutline,
    mdiEyeOutline
} from '@mdi/js';
import { store } from '../store.js';


type Dict = { [key: string]: any };
const showMemoCreateModal = ref(false);
const showMemoRenameModal = ref(false);
const showMemoDeleteModal = ref(false);
const memoInfo = ref<Dict>({});
const initialMemoTitle = ref();
const initialMarkdownText = ref();
const isMarkDownActivated = ref(false);
const isRenameActivated = ref(false);
const notificationMessage = ref();

const changeMarkdownContent = (memoTitle: string | number) => {
    if (!isMarkDownActivated.value) {
        isMarkDownActivated.value = true;
    }

    isRenameActivated.value = false;

    const newText = memoInfo.value['memoList'][memoTitle]['content'];
    initialMemoTitle.value = memoTitle;
    initialMarkdownText.value = newText;
}

const fetchMemo = async () => {
    const memoInfoRaw = await fetch("https://api-myportal.vercel.app/api/list", {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!memoInfoRaw.ok) {
        return {
            'memoList': {
                'テスト': {
                    'content': 'テスト用'
                },
                'テスト2': {
                    'content': 'テスト2用'
                }
            }
        };
    } else {
        return memoInfoRaw.json();
    }
}

const saveMemo = async (memoTitle: string, markdownText: string) => {
    const data = {
        'memoTitle': memoTitle,
        'markdownText': markdownText
    };

    const response = await fetch("https://api-myportal.vercel.app/api/save", {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        notificationMessage.value = memoTitle + ' : 保存しました';
        setTimeout(() => {
            notificationMessage.value = '';
        }, 3000);
        memoInfo.value = await response.json();
    }
}

const renameMemo = async (oldMemoTitle: string, newMemoTitle: string, markdownText: string) => {
    const data = {
        'memoTitle': oldMemoTitle,
        'newMemoTitle': newMemoTitle,
        'markdownText': markdownText
    };

    const response = await fetch("https://api-myportal.vercel.app/api/rename", {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        notificationMessage.value = '変更しました : ' + oldMemoTitle + ' → ' + newMemoTitle;
        setTimeout(() => {
            notificationMessage.value = '';
        }, 3000);
        memoInfo.value = await response.json();
        initialMemoTitle.value = newMemoTitle;
    }
}

const deleteMemo = async () => {
    const data = {
        'memoTitle': initialMemoTitle.value,
    };

    const response = await fetch("https://api-myportal.vercel.app/api/delete", {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response) {
        memoInfo.value = await response.json();
    }
}

const switchEditorMode = () => {
    const splitEditor = document.getElementsByClassName('milkdown-split-editor')[0];
    const toggleButton = document.getElementById('switch-editor-mode-toggle-button') as HTMLElement;
    if (splitEditor.classList.length === 2) {
        splitEditor.setAttribute('class', 'milkdown-split-editor');
        toggleButton.setAttribute('class', 'btn-default btn-small btn-active');
    } else {
        splitEditor.setAttribute('class', 'milkdown-split-editor hidden');
        document.getElementById('switch-editor-mode-toggle-button')?.setAttribute('class', 'btn-active');
        toggleButton.setAttribute('class', 'btn-default btn-small');
    }
}

const switchContentEditable = () => {
    const editor = document.getElementsByClassName('ProseMirror markdown-body editor')[0];
    const toggleButton = document.getElementById('switch-content-editable-toggle-button') as HTMLElement;
    if (editor.getAttribute('contenteditable') === 'true') {
        editor.setAttribute('contenteditable', 'false');
        toggleButton.setAttribute('class', 'btn-default btn-small btn-active');
    } else {
        editor.setAttribute('contenteditable', 'true');
        toggleButton.setAttribute('class', 'btn-default btn-small');
    }
}

export default {
    components: {
        MilkdownEditor,
        MilkdownProvider,
        ProsemirrorAdapterProvider,
        FileCreateModal,
        FileRenameModal,
        FileDeleteModal
    },

    setup() {
        return {
            showMemoCreateModal,
            showMemoRenameModal,
            showMemoDeleteModal,
            memoInfo,
            initialMarkdownText,
            initialMemoTitle,
            isMarkDownActivated,
            isRenameActivated,
            notificationMessage,
            mdiPlus,
            mdiNoteEdit,
            mdiRename,
            mdiDelete,
            mdiNumeric2BoxMultipleOutline,
            mdiEyeOutline,
            fetchMemo,
            saveMemo,
            renameMemo,
            deleteMemo,
            switchEditorMode,
            switchContentEditable,
            changeMarkdownContent,
        }
    },

    async beforeRouteEnter() {
        store.loading = 'pending';
        setTimeout(() => {
            if (store.loading === 'pending') {
                store.loading = 'true';
            }
        }, 1000);
        memoInfo.value = await fetchMemo();
        store.loading = 'false';
        isMarkDownActivated.value = false;
    },

    // beforeRouteLeave() {
    //     store.loading = 'pending';
    //     setTimeout(() => {
    //         if (store.loading === 'pending') {
    //             store.loading = 'true';
    //         }
    //     }, 1000);
    // }
}
</script>

<template>
    <div class="main-wrapper">
        <div class="side-bar">
            <div class="side-bar-header">
                <div class="side-bar-header-left">
                    メモ
                </div>
                <div class="side-bar-header-right">
                    <button class="btn-default btn-small" @click="showMemoCreateModal = true">
                        <v-icon :icon="mdiPlus" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                </div>
            </div>

            <div class="side-bar-content">
                <a v-for="(memoData, memoTitle) in memoInfo['memoList']" class="side-bar-item"
                    @click="changeMarkdownContent(memoTitle)">{{ memoTitle }}
                </a>
                <!-- <a class="side-bar-item add-memo-btn" @click="showMemoCreateModal = true">
                    <v-icon :icon="mdiPlus" size=20></v-icon>
                </a> -->
            </div>
        </div>
        <div v-if="!isMarkDownActivated" class="markdown-default">
            <v-icon :icon="mdiNoteEdit" size=40 color="rgb(174, 174, 174)"></v-icon>
        </div>
        <div class="main-content" v-else>
            <div class="markdown-menu">
                <div class="markdown-menu-left">
                    <p>{{ initialMemoTitle }}</p>
                </div>
                <div class="markdown-menu-right">
                    <p>{{ notificationMessage }}</p>
                    <button class="btn-default btn-small" id="switch-editor-mode-toggle-button" @click=switchEditorMode>
                        <v-icon :icon="mdiNumeric2BoxMultipleOutline" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                    <button class="btn-default btn-small" id="switch-content-editable-toggle-button"
                        @click=switchContentEditable>
                        <v-icon :icon="mdiEyeOutline" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                    <button class="btn-default btn-small" @click="showMemoRenameModal = true">
                        <v-icon :icon="mdiRename" size=20 color="rgb(95, 95, 95)"></v-icon>
                    </button>
                    <button class="btn-danger btn-small" @click="showMemoDeleteModal = true">
                        <v-icon :icon="mdiDelete" size=20 color="white"></v-icon>
                    </button>
                </div>
            </div>
            <div class="markdown">
                <MilkdownProvider>
                    <ProsemirrorAdapterProvider>
                        <MilkdownEditor @update="(e: Dict) => saveMemo(e['memoTitle'], e['markdownText'])" @rename="(e: Dict) => {
                            renameMemo(e['oldMemoTitle'], e['newMemoTitle'], e['markdownText']);
                        }" :initial-memo-title="initialMemoTitle" :initial-markdown-text="initialMarkdownText"
                            :is-rename-activated="isRenameActivated" />
                    </ProsemirrorAdapterProvider>
                </MilkdownProvider>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <FileCreateModal :show="showMemoCreateModal" @close="showMemoCreateModal = false" @create="(memoTitle: string) => {
            saveMemo(memoTitle, '');
            showMemoCreateModal = false;
        }">
        </FileCreateModal>
        <FileRenameModal :show="showMemoRenameModal" @close="showMemoRenameModal = false" @rename="(newMemoTitle: string) => {
            isRenameActivated = true;
            initialMemoTitle = newMemoTitle;
            showMemoRenameModal = false;
        }">
        </FileRenameModal>
        <FileDeleteModal :show="showMemoDeleteModal" @close="showMemoDeleteModal = false" @delete="() => {
            isMarkDownActivated = false;
            deleteMemo();
            showMemoDeleteModal = false;
        }">
        </FileDeleteModal>
    </Teleport>
</template>

<style scoped>
.main-wrapper {
    display: flex;
    height: calc(100vh - 35px);
    width: 100vw;
}

.side-bar {
    width: 15vw;
    height: calc(100vh - 35px);
    flex-flow: column;
    border-right: 1px solid rgb(200, 200, 200);
}

.side-bar-content {
    overflow-y: scroll;
    height: calc(100vh - 75px);
}

.side-bar::-webkit-scrollbar {
    display: none;
}

.side-bar-header {
    background-color: rgb(0, 86, 173);
    color: white;
    height: 40px;
    display: flex;
    align-items: center;
}

.side-bar-item {
    display: block;
    cursor: pointer;
    padding: 4px 10px;
    border-bottom: 1px solid rgb(200, 200, 200);
    font-size: 12px;
}

.side-bar-header-left {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 5px;
}

.side-bar-header-right {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
}

.side-bar-item:hover {
    background-color: rgb(180, 225, 235);
}


.add-memo-btn {
    text-align: center;
    border-bottom: none;
}

.main-content {
    width: 85vw;
}

.markdown-menu {
    display: flex;
    height: 40px;
    padding: 0 15px;
    color: white;
    background-color: rgb(0, 86, 173);
}

.markdown-menu button {
    margin-left: 7px;
}

.markdown-menu-left {
    flex: 1;
    display: flex;
    align-items: center;
}

.markdown-menu-right {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.markdown {
    height: calc(100vh - 75px);
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
}

.markdown-default {
    flex: 6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 35px);
    font-size: 20px;
    color: rgb(174, 174, 174);
}
</style>