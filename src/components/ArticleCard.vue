<script setup lang="ts">
import { onMounted } from 'vue'

interface ArticleInfo {
    paper: string,
    color: string,
    articleList: {
        title: string,
    }[]
}

defineProps<{
    articleInfo: ArticleInfo
}>()
</script>

<template>
    <div class="card">
        <div class="paper" :style="{ backgroundColor: articleInfo.color }">
            <h2>{{ articleInfo.paper }}</h2>
        </div>
        <div class="article" v-for="article in articleInfo.articleList">
            <h3>{{ article.title }}</h3>
        </div>
    </div>
</template>

<style scoped>
.card {
    display: block;
    background-color: rgb(241, 252, 255);
    border: 1px solid grey;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    width: 47%;
    box-sizing: border-box;
}

.paper {
    margin: -10px -10px 5px -10px;
    border-radius: 10px 10px 0 0;
    color: white;
    padding: 10px;
}

.paper h2 {
    font-weight: 700;
}

.article {
    margin-bottom: 15px;
}
</style>