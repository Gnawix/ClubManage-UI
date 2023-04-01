<template>
    <div class="news-detail">
        <el-form ref="form" :model="form" label-width="80px">
            <span>标题</span>
            <el-input v-model="form.title" placeholder="请输入标题" style="width: 40%; margin: 0 20px 20px 10px;"></el-input>
            <el-button type="primary" @click="openDialog">标题图片</el-button>
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
                <image-upload v-model="form.img" />
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="closeDialog">确定</el-button>
                    <el-button @click="closeDialog">取消</el-button>
                </div>
            </el-dialog>
            <div class="buttons" style="float: right;">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
            <div class="ql-container ql-snow">
                <editor v-model="form.content" />
            </div>
        </el-form>
    </div>
</template>
  
<script>
import { getNews, updateNews } from "@/api/system/news";
import { eventBus } from "@/utils/event-bus"

export default {
    data() {
        return {
            news: {},
            dialogVisible: false,
            dialogTitle: '上传图片',
            form: {},
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
                this.form = this.news;
            });
        },
        submitForm() {
            updateNews(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                eventBus.$emit('updateNewsList');
                this.$router.push('/news');
            });
        },
        cancel() {
            this.$router.push('/news');
        },
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        }
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