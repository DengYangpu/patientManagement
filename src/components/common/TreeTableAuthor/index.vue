<template>
  <div class>
    <el-tree
      class="tree-style"
      :data="data"
      show-checkbox
      node-key="id"
      ref="tree"
      accordion
      :props="props"
      :render-content="renderContent"
      @check-change="handleCheckChange"
      :check-strictly="checkFlg"
      :default-checked-keys="defaultAuth"
    ></el-tree>
  </div>
</template>
<script>
export default {
  name: "treeTable",
  data() {
    return {
      checkFlg: true,
    };
  },
  props: {
    data: {
      type: [Array, Object],
      required: true,
    },
    defaultAuth: {
      type: Array,
    },
    props: {
      type: Object
    }
  },
  mounted() {
    // console.log(this.defaultAuth);
    // this.close()
  },
  beforeDestroy() {
    // console.log(this.defaultAuth);
    // this.close()
  },
  methods: {
    // 内容区渲染后执行 判断底层 赋 class
    renderContent(h, { node, data, store }) {
      let classname = "";
      // 第三层节点添加className
      if (node.level === 3) {
        classname = "levelname";
      }
      return <p class={classname}>{node.label}</p>;
    },
    handleCheckChange(data, checked, indeterminate) {
      let res = this.$refs.tree.getCheckedNodes();
      let arr = [];
      res.forEach((item) => {
        arr.push(item.id);
      });
      let menuArr = this.unique(arr); // 去除重复的节点
      // console.log(menuArr);
      // this.permissionIds = menuArr.join(",");
      this.$emit('getMenuArr', menuArr)
    },
    // 数组去重
    unique(arr) {
      let newArr = [];
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    // close() {
    // const defaultAuth = this.defaultAuth;
    // // console.log(defaultAuth);
    // this.$refs.tree.setCheckedKeys(defaultAuth)
    // }
  },
};
</script>
<style >
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>