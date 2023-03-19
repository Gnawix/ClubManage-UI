<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动标题" prop="actTitle">
        <el-input
          v-model="queryParams.actTitle"
          placeholder="请输入活动标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="时间" prop="actTime">
        <el-date-picker clearable
          v-model="queryParams.actTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="地点" prop="actLocation">
        <el-input
          v-model="queryParams.actLocation"
          placeholder="请输入地点"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="创建用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入创建用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建部门id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入创建部门id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:activity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:activity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:activity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:activity:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="活动id" align="center" prop="actId" /> -->
      <el-table-column label="活动标题" align="center" prop="actTitle" />
      <el-table-column label="活动内容" align="center" prop="actContent" />
      <el-table-column label="时间" align="center" prop="actTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.actTime, '{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" align="center" prop="actLocation" />
      <!-- <el-table-column label="创建用户id" align="center" prop="userId" /> -->
      <!-- <el-table-column label="创建部门id" align="center" prop="deptId" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:activity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:activity:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="actTitle">
          <el-input v-model="form.actTitle" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动内容">
          <editor v-model="form.actContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="时间" prop="actTime">
          <el-date-picker clearable
            v-model="form.actTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地点" prop="actLocation">
          <el-input v-model="form.actLocation" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="创建用户id" prop="userId" hidden>
          <el-input v-model="form.userId" placeholder="请输入创建用户id" />
        </el-form-item>
        <el-form-item label="创建部门id" prop="deptId" hidden>
          <el-input v-model="form.deptId" placeholder="请输入创建部门id" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/system/activity";

export default {
  name: "Activity",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 活动表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        actTitle: null,
        actContent: null,
        actTime: null,
        actLocation: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询活动列表 */
    getList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        actId: null,
        actTitle: null,
        actContent: null,
        actTime: null,
        actLocation: null,
        userId: null,
        deptId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.actId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.userId = this.$store.state.user.userId;
      this.form.deptId = this.$store.state.user.deptId;
      this.open = true;
      this.title = "添加活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const actId = row.actId || this.ids
      getActivity(actId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改活动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.actId != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivity(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const actIds = row.actId || this.ids;
      this.$modal.confirm('是否确认删除活动编号为"' + actIds + '"的数据项？').then(function() {
        return delActivity(actIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/activity/export', {
        ...this.queryParams
      }, `activity_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
