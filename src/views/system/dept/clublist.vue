<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
        <el-form-item label="社团名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入社团名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="deptName" label="社团名称" width="160"></el-table-column>
        <el-table-column prop="content" label="社团简介" width="660"></el-table-column>
        <el-table-column label="" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="checkClubapplicationStatus === 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-arrow-left"
              @click="handleApproval(scope.row)"
            >申请加入</el-button>
          </div>
          <div v-else-if="checkClubapplicationStatus === 1">
            等待审批
          </div>
          <div v-else>
            <!-- 不可加入 -->
          </div>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </template>
  
  <script>
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
  import { addClubapplication, checkClubapplication } from "@/api/system/clubapplication";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  
  export default {
    name: "Dept",
    dicts: ['sys_normal_disable'],
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 表格树数据
        deptList: [],
        // 部门树选项
        deptOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部展开
        isExpandAll: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          deptName: undefined,
          status: undefined
        },
        checkClubapplicationStatus: "",
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          parentId: [
            { required: true, message: "上级部门不能为空", trigger: "blur" }
          ],
          deptName: [
            { required: true, message: "部门名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "显示排序不能为空", trigger: "blur" }
          ],
          email: [
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    mounted() {
      checkClubapplication().then(response => {
        this.checkClubapplicationStatus = response;
      })
    },
    methods: {
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data, "deptId");
          this.loading = false;
        });
      },
      /** 转换部门数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.deptId,
          label: node.deptName,
          children: node.children
        };
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          deptId: undefined,
          parentId: undefined,
          deptName: undefined,
          content: undefined,
          orderNum: undefined,
          leader: undefined,
          phone: undefined,
          email: undefined,
          status: "0"
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        if (row != undefined) {
          this.form.parentId = row.deptId;
        }
        /** 默认设置parentId为郑州大学, 排序为1 */
        this.form.parentId = 100;
        this.form.orderNum = 1;
        this.open = true;
        this.title = "添加部门";
        listDept().then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
        });
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getDept(row.deptId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改部门";
          listDeptExcludeChild(row.deptId).then(response => {
            this.deptOptions = this.handleTree(response.data, "deptId");
            if (this.deptOptions.length == 0) {
              const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
              this.deptOptions.push(noResultsOptions);
            }
          });
        });
      },
      /** 申请加入操作 */
      handleApproval(row) {
        var userId = this.$store.state.user.userId;
        this.$modal.confirm('是否确认申请加入"' + row.deptName + '"社团？').then(function() {
          return addClubapplication(row.deptId, userId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("申请成功");
          window.location.reload();
        }).catch(() => {});
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.deptId != undefined) {
              updateDept(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDept(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>
  
  
  <style>
  .el-textarea__inner{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  </style>