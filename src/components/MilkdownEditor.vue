<script setup lang="ts">
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx, editorViewOptionsCtx, type DefaultValue, editorState } from '@milkdown/core';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { nord } from '@milkdown/theme-nord'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm';
import { replaceAll } from '@milkdown/utils';
import { indent } from '@milkdown/plugin-indent';
import { clipboard } from '@milkdown/plugin-clipboard';
import { history } from '@milkdown/plugin-history';
import { cursor } from '@milkdown/plugin-cursor';
import { math } from '@milkdown/plugin-math';
import { splitEditing, splitEditingOptionsCtx } from '@milkdown-lab/plugin-split-editing';
// import { slashFactory } from '@milkdown/plugin-slash';
import { usePluginViewFactory, type VuePluginViewComponent } from '@prosemirror-adapter/vue';
import { ref, onBeforeUpdate } from 'vue';
import 'katex/dist/katex.min.css';
// import Slash from './Slash.vue';

const props = defineProps({
    initialMemoTitle: String,
    initialMarkdownText: String,
    isRenameActivated: Boolean,
});
const emit = defineEmits(['update', 'rename']);

const memoTitle = ref(props.initialMemoTitle);
const markdownText = ref(props.initialMarkdownText);

const editor = Editor.make();

// const tooltip = slashFactory('Commands');
const pluginViewFactory = usePluginViewFactory();

useEditor((root) => {
    const content: DefaultValue = markdownText.value as DefaultValue;
    return editor
        .config(nord)
        .config((ctx) => {
            ctx.set(rootCtx, root);
            ctx.set(defaultValueCtx, content);
            // ctx.set(tooltip.key, {
            //     view: pluginViewFactory({
            //         component: Slash as VuePluginViewComponent
            //     }),
            // })
            ctx.set(splitEditingOptionsCtx.key, {
                attributes: { class: 'milkdown-split-editor hidden' },
            })
            ctx.update(editorViewOptionsCtx, (prev) => ({
                ...prev,
                attributes: { class: 'markdown-body', spellcheck: 'false' },
            }));
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                markdownText.value = markdown;
            });
        })
        .use(commonmark)
        .use(gfm)
        .use(indent)
        .use(clipboard)
        .use(cursor)
        .use(math)
        .use(history)
        .use(listener)
        // .use(tooltip)
        .use(splitEditing);
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        emit('update', {
            'memoTitle': memoTitle.value as string,
            'markdownText': markdownText.value as string
        });
    }
});

onBeforeUpdate(() => {
    if (props.isRenameActivated === true) {
        emit('rename', {
            'oldMemoTitle': memoTitle.value as string,
            'newMemoTitle': props.initialMemoTitle as string,
            'markdownText': markdownText.value as string,
        })
        memoTitle.value = props.initialMemoTitle;
    } else {


        emit('update', {
            'memoTitle': memoTitle.value as string,
            'markdownText': markdownText.value as string,
        });

        memoTitle.value = props.initialMemoTitle;
        markdownText.value = props.initialMarkdownText;
        editor.action(replaceAll(markdownText.value as string));
    }
});
</script>

<template>
    <Milkdown />
</template>

<style scoped></style>
