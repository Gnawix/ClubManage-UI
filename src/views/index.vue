<template>
  <div class="app-container home">
    <el-row :gutter="20" style="margin: 0 20px 0 20px;">
      <el-carousel :interval="4000" type="card" height="250px" width="100px">
        <el-carousel-item v-for="(item, index) in newsList.slice(0, 6)" :key="item">
          <div class="carousel-item" @click="goTarget(item.href)">
            <img :src="item.img" width="100%"/>
          </div>
          <h3>{{ item.title }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row :gutter="20" style="margin: 0 20px 0 20px;">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="update-log" style="margin-right: 10px;">
          <div slot="header" class="clearfix">
            <span>新闻</span>
          </div>
          <div class="body" v-for="(item, index) in newsList" :key="index">
            <el-row style="margin-left: 20px;">
              <li>
                <el-col :span="18">
                  {{ item.title }}
                </el-col>
                <el-col :span="6">
                  {{ parseTime(item.time, '{m}-{d} {h}:{i}') }}
                </el-col>
              </li>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="update-log" style="margin-left: 10px;">
          <div slot="header" class="clearfix">
            <span>活动</span>
          </div>
          <div class="body" v-for="(item, index) in newsList" :key="index">
            <el-row style="margin-left: 20px;">
              <li>
                <el-col :span="18">
                  {{ item.title }}
                </el-col>
                <el-col :span="6">
                  {{ parseTime(item.time, '{m}-{d} {h}:{i}') }}
                </el-col>
              </li>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listNews } from "@/api/system/news";

export default {
  name: "Index",
  data() {
    return {
      newsList: []
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getList() {
      this.loading = true;
      listNews(this.queryParams).then(response => {
        this.newsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>

