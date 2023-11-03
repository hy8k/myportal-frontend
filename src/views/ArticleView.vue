<script setup lang="ts">
import { ref } from 'vue';
import ArticleCard from '@/components/ArticleCard.vue';

interface ArticleInfo {
    paper: string,
    color: string,
    articleList: {
        title: string,
        body: string
    }[]
}

const articleData = ref<Array<ArticleInfo>>()

fetch('./getArticleData.php')
    .then((response) => response.json())
    .then((data: Array<ArticleInfo>) => {
        articleData.value = data
    }).catch(() => {
        const dummy: Array<ArticleInfo> = [
            {
                paper: "朝日新聞",
                color: "cyan",
                articleList: [
                    {
                        title: "千葉市職員が逮捕",
                        body: "千葉市職員の五十嵐隆二容疑者が逮捕された。"
                    },
                    {
                        title: "東京工業大学の学生が快挙　逃走した容疑者を確保",
                        body: "東京工業大学の学生である森田さんが現場から逃走しようとした容疑者を確保し，警察から表彰を受けた"
                    },
                ]
            },
            {
                paper: "東京新聞",
                color: "blue",
                articleList: [
                    {
                        title: "千葉市職員が逮捕",
                        body: "千葉市職員の五十嵐隆二容疑者が逮捕された。"
                    },
                    {
                        title: "東京工業大学の学生が快挙　逃走した容疑者を確保",
                        body: "東京工業大学の学生である森田さんが現場から逃走しようとした容疑者を確保し，警察から表彰を受けた"
                    },
                ]
            }
        ]
        articleData.value = dummy
    })
</script>

<template>
    <h1>各紙最新記事</h1>
    <div class="article-area">
        <ArticleCard v-for="(articleinfo, key) in articleData" :article-info="articleinfo" :key="key" />
    </div>
</template>

<style scoped>
.article-area {
    display: flex;
    flex-wrap: wrap;
}
</style>