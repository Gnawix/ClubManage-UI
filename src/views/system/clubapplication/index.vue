<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="社团名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入社团名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="审核状态" prop="applicationStatus">
        <el-input
          v-model="queryParams.applicationStatus"
          placeholder="审核状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="审核状态" prop="applicationStatus">
        <el-select v-model="queryParams.applicationStatus" placeholder="请选择审核状态" clearable @change="handleQuery">
          <el-option v-for="dict in dict.type.sys_application_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:clubapplication:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:clubapplication:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:clubapplication:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:clubapplication:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="clubapplicationList" @selection-change="handleSelectionChange">
      <el-table-column label="社团名称" align="center" prop="deptName" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="审核状态" align="center" prop="applicationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_application_status" :value="scope.row.applicationStatus" />
        </template>
      </el-table-column>
      <el-table-column label="" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.applicationStatus === '0'">
            <el-button size="mini" type="text" icon="el-icon-check" @click="handleApproval(scope.row)"
              v-hasPermi="['system:clubapplication:approval']">同意</el-button>
            <el-button size="mini" type="text" icon="el-icon-close" @click="handleReject(scope.row)"
              v-hasPermi="['system:clubapplication:reject']">拒绝</el-button>
          </div>
          <div v-else>
            已审批
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改社团申请列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="社团id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入社团id" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="0待审批 1同意 2拒绝" prop="applicationStatus">
          <el-input v-model="form.applicationStatus" placeholder="请输入0待审批 1同意 2拒绝" />
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
import { listClubapplication, getClubapplication, delClubapplication, addClubapplication, updateClubapplication, rejectClubapplication, approvalClubapplication } from "@/api/system/clubapplication";

export default {
  name: "Clubapplication",
  dicts: ['sys_application_status'],
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
      // 社团申请列表表格数据
      clubapplicationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        userId: null,
        applicationStatus: null
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
    /** 查询社团申请列表列表 */
    getList() {
      this.loading = true;
      listClubapplication(this.queryParams).then(response => {
        this.clubapplicationList = response.rows;
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
        id: null,
        deptId: null,
        userId: null,
        applicationStatus: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加社团申请列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClubapplication(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改社团申请列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClubapplication(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClubapplication(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除社团申请列表编号为"' + ids + '"的数据项？').then(function () {
        return delClubapplication(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 同意按钮操作 */
    handleApproval(row) {
      const id = row.id;
      this.$modal.confirm('是否同意该条申请？').then(function () {
        return approvalClubapplication(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    /** 拒绝按钮操作 */
    handleReject(row) {
      const id = row.id;
      this.$modal.confirm('是否拒绝该条申请？').then(function () {
        return rejectClubapplication(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/clubapplication/export', {
        ...this.queryParams
      }, `clubapplication_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
