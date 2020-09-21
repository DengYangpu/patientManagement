<template>
  <div class="roleGroup">
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" disabled v-model="searchVal" placeholder="输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" disabled type="primary" icon="el-icon-search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 角色组表单 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      highlight-current-row
      :tree-props="{children: 'child', hasChildren: 'hasChild'}"
    >
      <el-table-column prop="id" label="ID" width="250"></el-table-column>
      <el-table-column prop="name" label="组名" width="250"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ? 'primary' : 'danger'"
            disable-transitions
          >{{scope.row.status ? '正常' : '隐藏'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="380">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 and 父添加-->
    <el-dialog :title="title" :visible.sync="editOrAddFlag" destroy-on-close @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="组名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组权限" prop="tree" :label-width="formLabelWidth">
          <treeTable
            :props="{children: 'child',label: 'title'}"
            :data="data"
            :defaultAuth="form.tree"
            @getMenuArr="getMenuArr"
          ></treeTable>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrAddFlag = false">取 消</el-button>
        <el-button type="primary" @click="keepForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeTable from "../../common/TreeTableAuthor/index";
import {
  getGroup,
  getGroupRules,
  addGroup,
  delGroup,
  editGroup,
} from "../../../network/api";
export default {
  components: { treeTable },
  name: "roleGroup",
  data() {
    return {
      searchVal: "",
      tableData: [],
      data: [],
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { max: 20, message: "长度 20 个字符", trigger: "blur" },
        ],
        tree: [
          {
            type: "array",
            required: true,
            message: "请勾选权限",
            trigger: "blur",
          },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      editOrAddFlag: false,
      formLabelWidth: "120px",
      form: {
        name: null,
        rules: "",
        tree: [],
        status: "",
        pid: 0,
      },
      checkFlg: false,
      title: "添加",
    };
  },
  created() {
    this.getGroup();
    const groupId = this.$store.state.userInfo.groupId;
    this.getGroupRules(groupId);
  },
  methods: {
    /**
     * 获取初始化数据
     */
    getGroup() {
      const userId = this.$store.state.userInfo.id;
      getGroup({ userId }).then((res) => {
        if (res.code == 1) {
          this.tableData = res.value;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取初始化权限
    getGroupRules(groupId) {
      const userId = this.$store.state.userInfo.id;
      getGroupRules({userId,groupId }).then((res) => {
        if (res.code == 1) {
          this.data = res.value;
          // 把数据存入vuex
          this.$store.commit("SET_RULE", res.value);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 权限选择
    getMenuArr(e) {
      this.form.tree = e;
    },
    /**
     * 修改组 and 添加
     */
    handleEdit(index, row) {
      this.editOrAddFlag = true;
      this.form.userId = this.$store.state.userInfo.id;
      if (row != undefined && row != "undefined") {
      this.getGroupRules(row.id)
        this.title = "编辑";
        this.form.name = row.name;
        this.form.tree = row.rules;
        this.form.status = row.status;
        this.form.pid = row.pid;
        this.form.groupId = row.id;
      } else {
        this.title = "添加";
        this.form.name = "";
        this.form.rules = "";
        this.form.tree = [];
        this.form.status = "";
        this.form.pid = 0;
      }
    },
    /**
     * 删除组
     */
    handleDel(index, row) {
      const userId = this.$store.state.userInfo.id;
      // console.log(index, row);
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delGroup({ groupIds: row.id, userId })
            .then((res) => {
              if (res.code == 1) {
                this.getGroup();
                this.$message({
                  type: "success",
                  message: "角色组已删除！",
                });
              } else {
                this.$message({
                  type: "info",
                  message: res.message,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("角色组删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 添加子组
     */
    handleAdd(index, row) {
      this.title = "添加子组";
      this.getGroupRules(row.id)
      this.editOrAddFlag = true;
      this.form.userId = this.$store.state.userInfo.id;
      this.form.name = "";
      this.form.rules = "";
      this.form.tree = [];
      this.form.status = "";
      this.form.pid = row.id;
    },
    /**
     * 保存
     */
    keepForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.title == "编辑") {
            this.form.rules = this.form.tree.join(",");
            editGroup(this.form)
              .then((res) => {
                this.editOrAddFlag = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getGroup();
                  this.$message({
                    type: "success",
                    message: "角色组编辑成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((res) => {
                this.editOrAddFlag = false;
                this.loading = false;
                this.$message.error("角色保存失败，请稍后再试！");
              });
          } else {
            this.form.rules = this.form.tree.join(",");
            addGroup(this.form)
              .then((res) => {
                this.editOrAddFlag = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getGroup();
                  this.$message({
                    type: "success",
                    message: "角色组保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((err) => {
                this.editOrAddFlag = false;
                this.loading = false;
                this.$message.error("角色保存失败，请稍后再试！");
              });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 关闭dialog前回调
     */
    closeDialog() {
      this.form.tree = [];
    },
  },
};
</script>
<style scoped>
</style>