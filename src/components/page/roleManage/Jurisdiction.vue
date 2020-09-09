<template>
  <div class="Jurisdiction">
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" placeholder="输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 权限表单 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      highlight-current-row
      :tree-props="{children: 'child', hasChildren: 'hasChild'}"
    >
      <el-table-column prop="id" label="id" width="120"></el-table-column>
      <el-table-column prop="title" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="icon" label="权限图标" width="150" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="权限简介"></el-table-column>
      <el-table-column prop="isMenu" label="是否菜单" align="center" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isMenu ? 'primary' : 'danger'"
            disable-transitions
            @click="switchClick('isMenu',scope.row)"
          >{{scope.row.isMenu ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="权限状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ? 'primary' : 'danger'"
            disable-transitions
            @click="switchClick('status' ,scope.row)"
          >{{scope.row.status ? '正常' : '禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="380">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 and 父添加-->
    <el-dialog :title="title" :visible.sync="editOrAddFlag">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="权限名称" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则(路由)" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">
          <e-icon-picker v-model="form.icon" />
        </el-form-item>
        <el-form-item label="简介" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单" prop="isMenu" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isMenu">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限状态" prop="status" :label-width="formLabelWidth">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
import { getRule, addRule, editRule, delRule } from "../../../network/api";
export default {
  name: "Jurisdiction",
  components: {},
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          status: false,
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          status: true,
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          status: true,
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              status: false,
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              status: true,
              children: [
                {
                  id: 33,
                  date: "2016-05-01",
                  name: "王小虎",
                  status: true,
                },
              ],
            },
          ],
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          status: 1,
        },
      ],
      rules: {
        title: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { max: 20, message: "长度 20 个字符", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        isMenu: [{ required: true, message: "请选择状态", trigger: "change" }],
        name: [{ required: true, message: "请输入权限规则", trigger: "blur" }],
      },
      editOrAddFlag: false,
      formLabelWidth: "120px",
      form: {
        title: "",
        name: null,
        status: null,
        isMenu: null,
        icon: null,
        remark: null,
        pid: 0,
        id: null,
      },
      title: "添加",
    };
  },
  created() {
    this.getRule();
  },
  methods: {
    // 获取初始化权限
    getRule() {
      const id = this.$store.state.userInfo.id;
      getRule({ page: 1, size: 1000, userId: id }).then((res) => {
        if (res.code == 1) {
          this.tableData = res.value;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getAuth(data) {
      let opt = [];
      data.forEach((val) => {
        opt.push(val.id);
        if (val.children) {
          val.children.forEach((el) => {
            console.log(val.id);
            if (el.selectchecked.length) {
              opt.push(el.id);
              opt.push(el.selectchecked);
            }
          });
        }
      });
      console.log(data);
      opt = opt
        .join()
        .split(",")
        .filter((n) => {
          return n;
        });
      console.log(opt);
    },
    /**
      编辑 and 添加
     */
    handleEdit(index, row) {
      this.editOrAddFlag = true;
      if (row != undefined && row != "undefined") {
        this.title = "编辑";
        this.form.name = row.name;
        this.form.title = row.title;
        this.form.status = row.status;
        this.form.icon = row.icon;
        this.form.remark = row.remark;
        this.form.isMenu = row.isMenu;
        this.form.pid = row.pid;
        this.form.id = row.id;
      } else {
        this.title = "添加";
        this.form.name = "";
        this.form.title = "";
        this.form.status = "";
        this.form.icon = "";
        this.form.remark = "";
        this.form.isMenu = 1;
        this.form.pid = 0;
      }
    },
    /**
     * 切换状态
     */
    switchClick(a, e) {
      this.form.icon = e.icon;
      this.form.id = e.id;
      this.form.pid = e.pid;
      this.form.remark = e.remark;
      this.form.sort = e.sort;
      this.form.name = e.name;
      this.form.title = e.title;
      this.form.userId = this.$store.state.userInfo.id;
      this.$confirm("此操作将切换状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (a == "status") {
            if (e.status) {
              this.form.status = 0;
              this.form.isMenu = e.isMenu;
            } else {
              this.form.status = 1;
              this.form.isMenu = e.isMenu;
            }
            editRule(this.form).then((res) => {
              if (res.code == 1) {
                this.getRule();
                this.$message({
                  type: "success",
                  message: "切换成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.message,
                });
              }
            });
          } else {
            if (e.isMenu) {
              this.form.status = e.status;
              this.form.isMenu = 0;
            } else {
              this.form.status = e.status;
              this.form.isMenu = 1;
            }
            editRule(this.form).then((res) => {
              console.log(res);
              if (res.code == 1) {
                this.getRule();
                this.$message({
                  type: "success",
                  message: "切换成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.message,
                });
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消切换",
          });
        });
    },
    /**
    删除操作
     */
    handleDel(index, row) {
      const id = this.$store.state.userInfo.id;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delRule({ userId: id, ruleIds: row.id })
            .then((res) => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "权限已删除！",
                });
                this.getRule();
              } else {
                this.$message({
                  type: "info",
                  message: res.message,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("删除失败，请稍后再试！");
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
     * 添加子权限
     */
    handleAdd(index, row) {
      this.editOrAddFlag = true;
      this.title = "添加子权限";
      this.form.name = "";
      this.form.title = row.title;
      this.form.status = "";
      this.form.icon = "";
      this.form.remark = "";
      this.form.isMenu = 0;
      this.form.pid = row.id;
    },

    /**
     * 保存
     */
    keepForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.form.userId = this.$store.state.userInfo.id;
          if (this.title == "编辑") {
            editRule(this.form)
              .then((res) => {
                this.editOrAddFlag = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getRule();
                  this.$message({
                    type: "success",
                    message: "修改成功",
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
                this.$message.error("编辑失败，请稍后再试！");
              });
          } else {
            addRule(this.form)
              .then((res) => {
                this.editOrAddFlag = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getRule();
                  this.$message({
                    type: "success",
                    message: "添加成功",
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
                this.$message.error("添加失败，请稍后再试！");
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.Jurisdiction >>> .el-tag--small {
  cursor: pointer;
}
</style>