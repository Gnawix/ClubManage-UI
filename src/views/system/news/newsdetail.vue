<template>
  <div class="news-detail">
    <!-- <h1>{{ news.title }}</h1>
    <img :src="news.img" :alt="news.title">
    <p>{{ news.content }}</p> -->
    <h1>hahahahhahahah</h1>
    <p>{{ this.$route.query.id }}</p>
    <p>{{ this.news.title }}</p>
    <h1>hahahahhahahah</h1>
  </div>
</template>

<script>
import { getNews } from "@/api/system/news";

export default {
  data() {
    return {
      news: {},
    };
  },
  mounted() {
    this.getNewsDetail();
  },
  methods: {
    getNewsDetail() {
      const id = this.$route.query.id;
      getNews(id).then((res) => {
        this.news = res;
      });
    },
  },
};








</script>