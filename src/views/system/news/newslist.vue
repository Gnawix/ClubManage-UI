<template>
    <el-row>
        <el-col :span="24">
            <el-card v-for="(item, index) in newsList" :key="index" style="margin: 25px;">
                <div style="display: flex;">
                    <image-preview :src="item.img" :width="240" :height="180" style="margin-right: 10px;" />
                    <div style="flex: 1; height: 180px; overflow: hidden; text-overflow: ellipsis; padding: 10px 20px;">
                        <h2>{{ item.title }}</h2>
                        <p>{{ item.summary }}</p>
                    </div>
                </div>
                <div class="bottom clearfix">
                    <time class="time">{{ item.time }}</time>
                    <el-button type="text" class="button">
                        <router-link :to="{ path: '/newslistdetail', query: { id: item.id } }">查看详情 </router-link>
                    </el-button>
                    
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
            newsList: []
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
.time {
    font-size: 13px;
    color: #999;
    margin-left: 10px;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
    margin-right: 10px;
    margin-bottom: 10px;
}

.el-card__body :scope {
    padding-right: 20px;
    height: 220px;
    margin-bottom: 20px;
}
</style>