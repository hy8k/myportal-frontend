<script setup lang="ts">
import { editorViewCtx } from "@milkdown/core";
import { SlashProvider } from "@milkdown/plugin-slash";
import { createCodeBlockCommand } from '@milkdown/preset-commonmark';
import { insertTableCommand } from "@milkdown/preset-gfm";
import { callCommand } from '@milkdown/utils';
import { useInstance } from '@milkdown/vue';
import { usePluginViewContext } from '@prosemirror-adapter/vue';
import {
    mdiCodeTags,
    mdiTable
} from '@mdi/js'
import { onMounted, onUnmounted, ref, type VNodeRef, watch } from 'vue';


const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref<VNodeRef>();

let tooltipProvider: SlashProvider;

onMounted(() => {
    tooltipProvider = new SlashProvider({
        content: divRef.value as any,
    })

    tooltipProvider.update(view.value, prevState.value)
})

watch(
    [view, prevState],
    () => {
        tooltipProvider?.update(view.value, prevState.value)
    }
)

onUnmounted(() => {
    tooltipProvider.destroy()
})

const addCodeBlock = (e: Event) => {
    if (loading.value) return;

    e.preventDefault()

    get()!.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;
        const { tr, selection } = state;
        const { from } = selection;
        dispatch(tr.deleteRange(from - 1, from))
        return callCommand(createCodeBlockCommand.key)(ctx)
    })
}

const insertTable = (e: Event) => {
    if (loading.value) return;

    e.preventDefault()

    get()!.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;
        const { tr, selection } = state;
        const { from } = selection;
        dispatch(tr.deleteRange(from - 1, from))
        return callCommand(insertTableCommand.key)(ctx)
    })
}

</script>

<template>
    <div ref="divRef">
        <button className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
            @mousedown="addCodeBlock">
            <v-icon :icon="mdiCodeTags" size=20 color="rgb(95, 95, 95)"></v-icon>

        </button>
        <button className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
            @mousedown="insertTable">
            <v-icon :icon="mdiTable" size=20 color="rgb(95, 95, 95)"></v-icon>
        </button>
    </div>
</template>

<style scoped>
button {
    margin-right: 10px;
    background-color: rgb(245, 245, 245);
}
</style>