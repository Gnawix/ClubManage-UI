<template>
  <div class="news-detail">
    <h1  align="center">{{ news.title }}</h1>
    <!-- <image-preview :src="news.img" :width="200" :height="180" style="margin-right: 10px;" /> -->
    <div class="ql-container ql-snow">
      <div class="ql-editor" v-html="news.content" />
    </div>
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
  padding: 20px;

  h1 {
    font-size: 40px;
    font-weight: bold;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>