<template>
  <div class="app-container home">
    <el-row :gutter="20" style="margin: 0 20px 0 20px;">
      <el-carousel :interval="4000" type="card" height="250px" width="100px">
        <el-carousel-item v-for="(item, index) in newsList.slice(0, 6)" :key="item">
          <router-link :to="{ path: '/newslistdetail', query: { id: item.id } }">
          <!-- <div class="carousel-item" @click="goTarget(item.href)"> -->
          <div class="carousel-item">
            <el-image :src="item.img" width="100%"/>
          </div>
          </router-link>
          <h3>{{ item.title }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row :gutter="20" style="margin: 0 20px 0 20px;">
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12"> -->
      <el-col :span="8">
        <el-card class="update-log" style="margin-right: 10px;">
          <div slot="header" class="clearfix"  align="center">
            <span>新闻</span>
          </div>
          <div class="body" v-for="(item, index) in newsList" :key="index">
            <router-link :to="{ path: '/newslistdetail', query: { id: item.id } }">
            <el-row style="margin-left: 20px; margin-bottom: 10px;">
              <li>
                <el-col :span="16">
                  {{ item.title }}
                </el-col>
                <el-col :span="8">
                  {{ parseTime(item.time, '{m}-{d} {h}:{i}') }}
                </el-col>
              </li>
            </el-row>
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="update-log" style="margin-left: 10px;">
          <div slot="header" class="clearfix">
            <span>活动</span>
          </div>
          <div class="body" v-for="(item, index) in activityList" :key="index">
            <el-row style="margin-left: 20px; margin-bottom: 10px;">
              <li>
                <el-col :span="8">
                  {{ item.actTitle }}
                </el-col>
                <el-col :span="8">
                  {{ item.actLocation }}
                </el-col>
                <el-col :span="8">
                  {{ parseTime(item.actTime, '{m}-{d} {h}:{i}') }}
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
import { listActivity } from "@/api/system/activity";

export default {
  name: "Index",
  data() {
    return {
      newsList: [],
      activityList: []
    };
  },
  mounted() {
    this.getNewsList(),
    this.getActivityList()
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getNewsList() {
      this.loading = true;
      listNews(this.queryParams).then(response => {
        this.newsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getActivityList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows;
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

