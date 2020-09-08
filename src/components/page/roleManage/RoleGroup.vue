<template>
  <div class="roleGroup">
    <!-- 搜索筛选 -->
    <el-form :inline="true" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="searchVal" placeholder="输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 角色组表单 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="date" label="日期" width="250"></el-table-column>
      <el-table-column prop="name" label="组名" width="250"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'primary' : 'danger'"
            disable-transitions
          >{{scope.row.status === 1 ? '正常' : '隐藏'}}</el-tag>
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
          <treeTable :data="data" :defaultAuth="form.tree" @getMenuArr="getMenuArr"></treeTable>
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
export default {
  components: { treeTable },
  name: "roleGroup",
  data() {
    return {
      searchVal: "",
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          status: 1,
          tree: [5, 10, 11],
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          status: 1,
          tree: [2, 10, 11],
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          status: 0,
          tree: [],
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              status: 1,
              tree: [],
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              status: 1,
              tree: [],
              children: [
                {
                  id: 33,
                  date: "2016-05-01",
                  name: "王小虎",
                  status: 1,
                  tree: [],
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
          tree: [],
        },
      ],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 20,
                  label: "三级 1-1-1",
                  children: [
                    {
                      id: 11,
                      label: "四级 1-1-1-1",
                    },
                  ],
                },
                {
                  id: 21,
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
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { max: 5, message: "长度 5 个字符", trigger: "blur" },
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
        tree: [],
        status: "",
      },
      checkFlg: false,
      title: "添加",
    };
  },
  methods: {
    // 权限选择
    getMenuArr(e) {
      this.form.tree = e;
    },
    /**
     * 修改组 and 添加
     */
    handleEdit(index, row) {
      this.editOrAddFlag = true;
      // console.log(this.form.tree);
      if (row != undefined && row != "undefined") {
        this.title = "编辑";
        this.form.name = row.name;
        this.form.tree = row.tree;
        this.form.status = row.status;
      } else {
        this.title = "添加";
        this.form.name = "";
        this.form.tree = [];
        this.form.status = "";
      }
    },
    /**
     * 删除组
     */
    handleDel(index, row) {
      // console.log(index, row);
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
    /**
     * 添加子组
     */
    handleAdd(index, row) {
      this.title = "添加子组";
      this.editOrAddFlag = true;
      const id = row.id;
    },
    /**
     * 保存
     */
    keepForm(editData) {
      console.log(this.form.tree);
      this.$refs[editData].validate((valid) => {
        if (valid) {
          // roleSave(this.editForm)
          //   .then((res) => {
          //     this.editFormVisible = false;
          //     this.loading = false;
          //     if (res.success) {
          //       this.getdata(this.formInline);
          //       this.$message({
          //         type: "success",
          //         message: "角色保存成功！",
          //       });
          //     } else {
          //       this.$message({
          //         type: "info",
          //         message: res.msg,
          //       });
          //     }
          //   })
          //   .catch((err) => {
          //     this.editFormVisible = false;
          //     this.loading = false;
          //     this.$message.error("角色保存失败，请稍后再试！");
          //   });
        } else {
          return false;
        }
      });
    },
    /** 
     * 关闭dialog前回调
    */
    closeDialog() {
      this.form.tree = []
    },
  },
};
</script>
<style scoped>
</style>