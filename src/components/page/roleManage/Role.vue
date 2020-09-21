<template>
  <div class="role">
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.text" @change="search" placeholder="输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        <!-- <el-button
          size="small"
          type="danger"
          icon="el-icon-delete-solid"
          @click="handleDel()"
          :disabled="delFlag"
        >批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
      <el-table-column prop="id" label="登录账号"></el-table-column>
      <el-table-column prop="username" label="名称"></el-table-column>
      <el-table-column prop="loginAt" label="最后登陆时间">
        <template slot-scope="scope">{{scope.row.loginAt | dateformat('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column prop="hospitalId" label="所在医院">
        <template slot-scope="scope">{{hospital(scope.row.hospitalId)}}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | status"
            disable-transitions
          >{{scope.row.status | statusText}}</el-tag>
        </template>
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
    <!-- 编辑界面 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="30%"
      destroy-on-close
      @close="closeDialog('edit')"
    >
      <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="名称" prop="username">
          <el-input
            size="small"
            v-model="editForm.username"
            auto-complete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            size="small"
            v-model="editForm.password"
            auto-complete="off"
            :placeholder="passwordText"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            size="small"
            v-model.number="editForm.mobile"
            auto-complete="off"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalId">
          <el-select v-model="editForm.hospitalId" placeholder="请选择医院">
            <el-option
              v-for="item in hospitalList"
              :key="item.value"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配角色" prop="groupId">
          <el-tree
            :props="RoleRightProps"
            :data="groupList"
            ref="tree"
            @check-change="getHospitalMenuArr"
            show-checkbox
            :check-strictly="true"
            :default-checked-keys="defaultEdit"
            node-key="id"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('edit')">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAdmin,
  getGroup,
  addAdmin,
  editAdmin,
  delAdmin,
  getHospital,
  searchAdmin,
} from "../../../network/api";
// import treeTable from "../../common/TreeTableAuthor/index";
export default {
  name: "role",
  components: {},
  data() {
    return {
      formInline: {
        text: '',
        tree: null,
      },
      that: this,
      groupList: [],
      hospitalList: [],
      loading: false, //是显示加载
      nshow: true, //switch开启
      fshow: false, //switch关闭
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      defaultEdit: [], // 默认权限
      editForm: {
        //编辑表单
        roleId: "",
        password: "",
        username: "",
        hospitalId: null,
        mobile: "",
        groupId: [],
        adminId: null,
      },
      passwordText: "请输入密码",
      // 删除
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 数据权限
      RoleRight: [],
      RoleRightProps: {
        children: "child",
        label: "name",
      },
      // 选中
      checkmenu: [],
      // delFlag: true,
      //参数role
      saveroleId: "",
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
        pageFlag: true,
      },
      jurisdictionFlag: false, // 权限分配弹框
      // rules 表单验证
      rules: {
        password: [
          { required: false, message: "请输入角色密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        groupId: [
          {
            type: "array",
            required: true,
            message: "请勾选权限",
            trigger: "change",
          },
        ],
        hospitalId: [
          { required: true, message: "请选择医院", trigger: "change" },
        ],
      },
    };
  },
  created() {
    let text = this.formInline.text;
    this.getdata(text);
    this.getGroup();
    this.getHospital();
  },
  filters: {
    // 状态框样式过滤
    status(status) {
      if (!status) return "danger";
      if (status == 100) {
        return "";
      } else if (status == -1) {
        return "danger";
      }
    },
    // 状态框文本过滤
    statusText(status) {
      if (!status) return "状态错误";
      if (status == 100) {
        return "正常";
      } else if (status == -1) {
        return "关闭";
      }
    },
  },
  methods: {
    hospital(hospitalId) {
      let hospital = "";
      this.hospitalList.forEach((v) => {
        if (v.id == hospitalId) {
          hospital = v.title;
        }
      });
      return hospital;
    },
    // 所属医院选择
    // 节点选中状态发生变化时的回调
    // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    getHospitalMenuArr(data, checked, indeterminate) {
      // 获取当前选择的id在数组中的索引
      const indexs = this.editForm.groupId.indexOf(data.id);
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.editForm.groupId.length === 1 && checked) {
        // console.log("only one");
        this.$message({
          message: "只能选择一个！",
          type: "error",
          showClose: true,
        });
        // 设置已选择的节点为false 很重要
        this.$refs.tree.setChecked(data, false);
      } else if (this.editForm.groupId.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.editForm.groupId = [];
        this.editForm.groupId.push(data.id);
      } else if (
        indexs >= 0 &&
        this.editForm.groupId.length === 1 &&
        !checked
      ) {
        // 再次直接进行赋值为空操作
        this.editForm.groupId = [];
      }
    },
    // 获取医院
    getHospital() {
      const userId = this.$store.state.userInfo.id;
      getHospital({ userId })
        .then((res) => {
          if (res.code == 1) {
            this.hospitalList = res.value;
          } else {
            this.$message({
              type: "info",
              message: res.message,
            });
          }
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error("获取医院失败，请稍后再试！");
        });
    },
    // 获取初始化权限
    getGroup() {
      const userId = this.$store.state.userInfo.id;
      getGroup({ userId })
        .then((res) => {
          if (res.code == 1) {
            this.groupList = res.value;
          } else {
            this.$message({
              type: "info",
              message: res.message,
            });
          }
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error("获取权限，请稍后再试！");
        });
    },
    // 搜索事件
    search() {
      const userId = this.$store.state.userInfo.id;
      let page = this.pageparm.currentPage;
      let size = this.pageparm.pageSize;
      let text = this.formInline.text;
      this.getdata(text);
    },
    handleSizeChange(val) {
      this.pageparm.pageSize = val;
      let text = this.formInline.text;
      this.getdata(text);
    },
    handleCurrentChange(val) {
      this.pageparm.currentPage = val;
      let text = this.formInline.text;
      this.getdata(text);
    },

    // 获取角色列表
    getdata(text) {
      const userId = this.$store.state.userInfo.id;
      let page = this.pageparm.currentPage;
      let size = this.pageparm.pageSize;
      this.loading = false;
      // 分页赋值
      // this.pageparm.currentPage = this.formInline.page;
      // this.pageparm.pageSize = this.formInline.limit;
      // this.pageparm.total = res.count;
      // 模拟数据结束
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      getAdmin({ userId, page, size, text })
        .then((res) => {
          this.loading = false;
          if (res.code != 1) {
            this.$message({
              type: "info",
              message: res.message,
            });
          } else {
            this.listData = res.value[0];

            // 分页赋值
            this.pageparm.total = res.value[1];
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("获取角色列表失败，请稍后再试！");
        });
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.roleId = row.id;
        this.editForm.password = "";
        this.editForm.mobile = row.mobile;
        this.editForm.username = row.username;
        this.editForm.hospitalId = row.hospitalId;
        this.editForm.groupId = [row.groupId];
        this.defaultEdit = [row.groupId];
        this.passwordText = "请输入密码(不输入为不修改)";
      } else {
        this.title = "添加";
        this.passwordText = "请输入密码";
        this.editForm.roleId = "";
        this.editForm.password = "";
        this.editForm.username = "";
        this.editForm.hospitalId = "";
        this.editForm.groupId = [];
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      let text = this.formInline.text;
      this.$refs[editData].validate((valid) => {
        if (valid) {
          const userId = this.$store.state.userInfo.id;
          if (this.title == "修改") {
            editAdmin({
              groupId: this.editForm.groupId[0],
              userId,
              adminId: this.editForm.roleId,
              hospitalId: this.editForm.hospitalId,
              password: this.editForm.password,
              username: this.editForm.username,
              mobile: this.editForm.mobile,
            })
              .then((res) => {
                this.editFormVisible = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getdata(text);
                  this.$message({
                    type: "success",
                    message: "角色保存成功！",
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((err) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("角色保存失败，请稍后再试！");
              });
          } else {
            addAdmin({
              groupId: this.editForm.groupId[0],
              userId,
              hospitalId: this.editForm.hospitalId,
              password: this.editForm.password,
              username: this.editForm.username,
              mobile: this.editForm.mobile,
            })
              .then((res) => {
                this.editFormVisible = false;
                this.loading = false;
                if (res.code == 1) {
                  this.getdata(text);
                  this.$message({
                    showClose: true,
                    message: "添加成功, 账号为:" + res.value.id + ' 请妥善保管！',
                    type: "success",
                    duration: 0,
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                }
              })
              .catch((err) => {
                this.editFormVisible = false;
                this.loading = false;
                this.$message.error("角色保存失败，请稍后再试！");
              });
          }
        } else {
          return false;
        }
      });
    },
    // 删除角色
    deleteUser(index, row) {
      const userId = this.$store.state.userInfo.id;
      let text = this.formInline.text;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAdmin({ adminId: row.id, userId })
            .then((res) => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "角色已删除！",
                });
                this.getdata(text);
              } else {
                this.$message({
                  type: "info",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("角色删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //批量删除
    // handleDel() {
    //   this.$confirm("确定要删除吗?", "信息", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       roleDelete(row.roleId)
    //         // .then((res) => {
    //         //   if (res.success) {
    //         //     this.$message({
    //         //       type: "success",
    //         //       message: "角色已删除！",
    //         //     });
    //         //     this.getdata(this.formInline);
    //         //   } else {
    //         //     this.$message({
    //         //       type: "info",
    //         //       message: res.msg,
    //         //     });
    //         //   }
    //         // })
    //         .catch((err) => {
    //           this.loading = false;
    //           this.$message.error("角色删除失败，请稍后再试！");
    //         });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
    // 数据权限
    menuAccess: function (index, row) {
      this.jurisdictionFlag = true;
      this.editForm.jurisdiction = row.jurisdiction;
      // RoleRightTree(row.roleId)
      //   .then((res) => {
      //     if (res.data.success) {
      //       this.$message({
      //         type: "success",
      //         message: "获取权限成功",
      //       });
      //       this.changemenu(res.data.data);
      //       this.RoleRight = this.changeArr(res.data.data);
      //     } else {
      //       this.$message({
      //         type: "info",
      //         message: res.data.msg,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     this.loading = false;
      //     this.$message.error("获取权限失败，请稍后再试！");
      //   });
    },

    // 选中菜单
    changemenu(val) {
      let change = [];
      for (let i = 0; i < val.length; i++) {
        change.push(val[i].roleId);
      }

      this.checkmenu = change;
    },
    // tree 递归
    changeArr(list) {
      var temptree = [],
        tree = [],
        items = [];
      for (var i in list) {
        if (!temptree[list[i].id]) {
          var trow = {
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: [],
          };
          temptree[list[i].id] = trow;
          items.push(trow);
        }
        if (list[i].uid > 0) {
          temptree[list[i].id]["children"].push({
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: [],
          });
        }
      }

      for (var j in items) {
        if (temptree[items[j].pId]) {
          temptree[items[j].pId]["children"].push(temptree[items[j].id]);
        } else {
          tree.push(temptree[items[j].id]);
        }
      }
      temptree = null;
      items = null;
      return tree;
    },
  
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == "edit") {
        this.editForm.groupId = [];
        this.editFormVisible = false;
      } else if (dialog == "perm") {
        this.menuAccessshow = false;
      } else if (dialog == "jurisdiction") {
        this.jurisdictionFlag = false;
      }
      // this.editForm.jurisdiction = [];
    },
  },
  computed: {
    // delFlag() {
    //   return this.checkmenu.length > 0 ? false : true;
    // },
  },
};
</script>
<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
.el-pagination {
  text-align: right;
}
</style>