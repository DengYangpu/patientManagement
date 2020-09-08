<template>
  <div class="role">
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.roleName" placeholder="输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input size="small" v-model="formInline.roleNo" placeholder="输入角色代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete-solid"
          @click="handleDel()"
          :disabled="delFlag"
        >批量删除</el-button>
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
      @selection-change="changemenu"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column sortable prop="roleNo" label="编码"></el-table-column>
      <el-table-column sortable prop="roleName" label="名称"></el-table-column>
      <el-table-column sortable prop="editTime" label="最后修改时间"></el-table-column>
      <el-table-column sortable prop="editUser" label="修改人"></el-table-column>
      <el-table-column sortable prop="status" label="状态">
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
          <el-button size="mini" type="success" @click="menuAccess(scope.$index, scope.row)">菜单权限</el-button>
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
        <el-form-item label="编码" prop="systemNo">
          <el-input
            size="small"
            v-model="editForm.systemNo"
            auto-complete="off"
            placeholder="请输入编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="roleName">
          <el-input
            size="small"
            v-model="editForm.roleName"
            auto-complete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="roleNo">
          <el-input size="small" v-model="editForm.roleNo" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospital">
          <tree-table
            :data="hospital"
            :defaultAuth="editForm.hospital"
            @getMenuArr="getHospitalMenuArr"
            border
          ></tree-table>
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

    <el-dialog
      title="添加权限"
      :visible.sync="jurisdictionFlag"
      width="30%"
      destroy-on-close
      @close="closeDialog('jurisdiction')"
    >
      <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="权限" prop="jurisdiction">
          <tree-table
            :data="hospital"
            :defaultAuth="editForm.jurisdiction"
            @getMenuArr="getHospitalMenuArr"
          ></tree-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import treeTable from "../../common/TreeTableAuthor/index";
export default {
  name: "role",
  components: { treeTable },
  data() {
    return {
      formInline: {
        roleName: null,
        roleNo: null,
        tree: null,
      },
      hospital: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  children: [
                    {
                      id: 11,
                      label: "四级 1-1-1-1",
                    },
                  ],
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
              children: [
                {
                  id: 9,
                  label: "三级 2-1-1",
                },
                {
                  id: 10,
                  label: "三级 2-1-2",
                },
              ],
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      loading: false, //是显示加载
      nshow: true, //switch开启
      fshow: false, //switch关闭
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        //编辑表单
        roleId: "",
        systemNo: "",
        roleNo: "",
        roleName: "",
        hospital: [],
      },
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
        children: "children",
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
        systemNo: [
          { required: true, message: "请输入系统编码", trigger: "blur" },
        ],
        roleNo: [
          { required: true, message: "请输入角色代码", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        jurisdiction: [
          {
            type: "array",
            required: true,
            message: "请勾选权限",
            trigger: "blur",
          },
        ],
        hospital: [
          {
            type: "array",
            required: true,
            message: "请勾选权限",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getdata();
  },
  filters: {
    // 状态框样式过滤
    status(status) {
      if (!status) return "danger";
      if (status == 101) {
        return "";
      } else if (status == 102) {
        return "info";
      } else if (status == 103) {
        return "danger";
      }
    },
    // 状态框文本过滤
    statusText(status) {
      if (!status) return "状态错误";
      if (status == 101) {
        return "正常";
      } else if (status == 102) {
        return "无权限";
      } else if (status == 103) {
        return "关闭";
      }
    },
  },
  methods: {
    // 所属医院选择
    getHospitalMenuArr(e) {
      console.log(e);
      this.formInline.tree = e;
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取角色列表
    getdata(parameter) {
      // 模拟数据
      let res = {
        code: 0,
        msg: null,
        count: 6,
        data: [
          {
            addUser: "root",
            editUser: "root",
            addTime: 1519182004000,
            editTime: 1520288426000,
            roleId: 1,
            systemNo: "pmd",
            roleNo: "Administrator",
            roleName: "超级管理员",
            hospital: [1],
            jurisdiction: [1, 2, 3],
            status: 101,
          },
          {
            addUser: null,
            editUser: null,
            addTime: 1521111376000,
            editTime: 1520678191000,
            roleId: 2,
            systemNo: "order",
            roleNo: "admin",
            roleName: "公司管理员",
            jurisdiction: [5, 10, 11],
            hospital: [2],
            status: 102,
          },
          {
            addUser: null,
            editUser: null,
            addTime: 1520678221000,
            editTime: 1520678221000,
            roleId: 95,
            systemNo: "pm",
            roleNo: "common",
            roleName: "普通用户",
            jurisdiction: [5, 13, 12],
            hospital: [2],
            status: 103,
          },
          {
            addUser: null,
            editUser: null,
            addTime: 1526349853000,
            editTime: 1526349853000,
            roleId: 96,
            systemNo: "1",
            roleNo: "1",
            roleName: "1",
            jurisdiction: [],
            hospital: [],
            status: 101,
          },
          {
            addUser: null,
            editUser: null,
            addTime: 1526349942000,
            editTime: 1526437443000,
            roleId: 97,
            systemNo: "2",
            roleNo: "2",
            roleName: "2",
            hospital: [],
            jurisdiction: [],
            status: 101,
          },
          {
            addUser: null,
            editUser: null,
            addTime: 1526652148000,
            editTime: 1526652148000,
            roleId: 101,
            systemNo: "test",
            roleNo: "demo",
            roleName: "演示角色",
            hospital: [],
            jurisdiction: [],
            status: 101,
          },
        ],
      };
      this.loading = false;
      this.listData = res.data;
      // 分页赋值
      // this.pageparm.currentPage = this.formInline.page;
      // this.pageparm.pageSize = this.formInline.limit;
      // this.pageparm.total = res.count;
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // roleList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.success == false) {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data
      //       // 分页赋值
      //       this.pageparm.currentPage = this.formInline.page
      //       this.pageparm.pageSize = this.formInline.limit
      //       this.pageparm.total = res.count
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('获取角色列表失败，请稍后再试！')
      //   })
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.roleId = row.roleId;
        this.editForm.systemNo = row.systemNo;
        this.editForm.roleNo = row.roleNo;
        this.editForm.roleName = row.roleName;
        this.editForm.hospital = row.hospital;
      } else {
        this.title = "添加";
        this.editForm.roleId = "";
        this.editForm.systemNo = "";
        this.editForm.roleNo = "";
        this.editForm.roleName = "";
        this.editForm.hospital = [];
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          roleSave(this.editForm)
            .then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              if (res.success) {
                this.getdata(this.formInline);
                this.$message({
                  type: "success",
                  message: "角色保存成功！",
                });
              } else {
                this.$message({
                  type: "info",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.editFormVisible = false;
              this.loading = false;
              this.$message.error("角色保存失败，请稍后再试！");
            });
        } else {
          return false;
        }
      });
    },
    // 删除角色
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roleDelete(row.roleId)
            .then((res) => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "角色已删除！",
                });
                this.getdata(this.formInline);
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
    handleDel() {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roleDelete(row.roleId)
            // .then((res) => {
            //   if (res.success) {
            //     this.$message({
            //       type: "success",
            //       message: "角色已删除！",
            //     });
            //     this.getdata(this.formInline);
            //   } else {
            //     this.$message({
            //       type: "info",
            //       message: res.msg,
            //     });
            //   }
            // })
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
    // 菜单权限-保存
    menuPermSave() {
      let parm = {
        roleId: this.saveroleId,
        moduleIds: "",
      };
      let node = this.$refs.tree.getCheckedNodes();
      let moduleIds = [];
      if (node.length != 0) {
        for (let i = 0; i < node.length; i++) {
          moduleIds.push(node[i].id);
        }
        parm.moduleIds = JSON.stringify(moduleIds);
      }
      RoleRightSave(parm)
        .then((res) => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "权限保存成功",
            });
            this.menuAccessshow = false;
            this.getdata(this.formInline);
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("权限保存失败，请稍后再试！");
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == "edit") {
        this.editFormVisible = false;
      } else if (dialog == "perm") {
        this.menuAccessshow = false;
      } else if (dialog == "jurisdiction") {
        this.jurisdictionFlag = false;
      }
      this.editForm.hospital = [];
      this.editForm.jurisdiction = [];
    },
  },
  computed: {
    delFlag() {
      return this.checkmenu.length > 0 ? false : true;
    },
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