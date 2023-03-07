<template>
    <el-row>
        <el-col :span="24">
            <el-card v-for="(item, index) in newsList" :key="index" style="margin: 20px;">
                <div style="display: flex;">
                    <image-preview :src="item.img" :width="240" :height="180" style="margin-right: 10px;" />
                    <div style="flex: 1; height: 180px; overflow: hidden; text-overflow: ellipsis;">
                        <span>{{ item.title }}</span>
                        <p>{{ item.content }}</p>
                    </div>
                </div>
                <div class="bottom clearfix">
                    <time class="time">{{ currentDate }}</time>
                    <el-button type="text" class="button">操作按钮</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>
  
<script>
import { listNews } from "@/api/system/news";

export default {
    data() {
        return {
            newsList: [],
            currentDate: new Date()
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            this.loading = true;
            listNews(this.queryParams).then(response => {
                this.newsList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        }
    }
}
</script>
  
<style>
.el-row {
    height: 230px;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}
.el-card__body {
  padding-right: 20px;
  height: 220px;
  margin-bottom: 20px;
}
</style>