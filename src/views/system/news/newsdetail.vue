<template>
  <div class="news-detail">
    <h1>{{ news.title }}</h1>
    <image-preview :src="news.img" :width="200" :height="180" style="margin-right: 10px;" />
    <p>{{ news.content }}</p>
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
        this.news = res.data;
      });
    },
  },
};

</script>

<style lang="scss" scoped>
.news-detail {
  padding: 80px;
  h1 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>