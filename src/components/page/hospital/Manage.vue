<template>
  <div class="manage">
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.text" @change="search" placeholder="请输入医院"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="hospitalList"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
      <el-table-column align="center" width="60" prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" align="center" label="医院名称"></el-table-column>
      <el-table-column prop="createAt" align="center" label="添加时间">
        <template slot-scope="scope">{{scope.row.createAt | dateformat('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
          <!-- <el-button size="mini" type="success" @click="menuAccess(scope.$index, scope.row)">菜单权限</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageparm.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageparm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageparm.total"
    ></el-pagination>
    <!-- 编辑 and 保存 对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="30%"
      destroy-on-close
      @close="closeDialog('edit')"
    >
      <el-form label-width="120px" :model="form" ref="form" :rules="rules">
        <el-form-item label="医院名称" prop="title">
          <el-input size="small" v-model="form.title" auto-complete="off" placeholder="请输入医院名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('edit')">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('form')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryHospital,
  addHospital,
  editHospital,
  delHospital,
} from "../../../network/api";
export default {
  name: "manage",
  data() {
    return {
      formInline: {
        text: "",
      },
      loading: false, //是显示加载
      nshow: true, //switch开启
      fshow: false, //switch关闭
      hospitalList: null, // 医院列表
      editFormVisible: false, // 对话框状态
      title: "添加", // 对话框标题
      form: {
        // 表单数据
        title: null,
        hospitalId: null,
        userId: null,
      },
      rules: {
        // 表单验证
        title: [
          { required: true, message: "医院名称不能为空", trigger: "blur" },
        ],
      },
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    let text = this.formInline.text;
    this.queryHospital(text);
  },
  methods: {
    // 获取医院
    queryHospital(text) {
      const userId = this.$store.state.userInfo.id;
      let page = this.pageparm.currentPage;
      let size = this.pageparm.pageSize;
      queryHospital({ userId, page, size, text }).then((res) => {
        if (res.code == 1) {
          this.hospitalList = res.value[0];
          this.pageparm.total = res.value[1];
        } else {
          this.$message({
            type: "info",
            message: res.message,
          });
        }
      });
    },
    // 搜索
    search() {
      let text = this.formInline.text;
      this.queryHospital(text)
    },
    // 编辑 and 添加
    handleEdit(index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "编辑";
        this.form.title = row.title;
        this.form.hospitalId = row.id;
      } else {
        this.title = "添加";
        this.form.title = "";
        this.form.hospitalId = null;
      }
    },
    // 保存
    submitForm(editData) {
      let text = this.formInline.text;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          const userId = this.$store.state.userInfo.id;
          let title = this.form.title;
          let hospitalId = this.form.hospitalId;
          if (this.title == "编辑") {
            editHospital({ userId, title, hospitalId })
              .then((res) => {
                if (res.code == 1) {
                  this.queryHospital(text);
                  this.editFormVisible = false;
                  this.$message({
                    type: "success",
                    message: "保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((res) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("保存失败，请稍后再试！");
              });
          } else {
            addHospital({ userId, title })
              .then((res) => {
                if (res.code == 1) {
                  this.queryHospital(text);
                  this.editFormVisible = false;
                  this.$message({
                    type: "success",
                    message: "保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((res) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("保存失败，请稍后再试！");
              });
          }
        }
      });
    },
    // 删除
    deleteUser(index, row) {
      const userId = this.$store.state.userInfo.id;
      let hospitalId = row.id;
      let text = this.formInline.text;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          delHospital({ userId, hospitalId })
            .then((res) => {
              if (res.code == 1) {
                this.queryHospital(text);
                this.editFormVisible = false;
                this.$message({
                  type: "success",
                  message: "删除成功",
                });
              } else {
                this.$message({
                  type: "info",
                  message: res.message,
                });
              }
            })
            .catch((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.$message.error("删除失败，请稍后再试！");
            });
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    closeDialog(e) {},
    // 分页
    handleSizeChange(val) {
      this.pageparm.pageSize = val;
      let text = this.formInline.text;
      this.queryHospital(text);
    },
    handleCurrentChange(val) {
      this.pageparm.currentPage = val;
      let text = this.formInline.text;
      this.queryHospital(text);
    },
  },
};
</script>
<style >
.el-pagination {
  text-align: right;
}
</style>