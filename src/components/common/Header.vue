<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="modifyPassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordFlag" destroy-on-close @close="modifyClose" >
      <el-form :model="passwordForm" ref="passwordForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="原密码" prop="used">
          <el-input type="password" v-model="passwordForm.used" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input type="password" v-model="passwordForm.new" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="again">
          <el-input type="password" v-model="passwordForm.again" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordFlag = false">取 消</el-button>
        <el-button type="primary" @click="modifyPasswordFlag = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      console.log(value);
      if (value == null) {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.new !== "") {
          // this.$refs.passwordForm.validateField("new");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.new) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      modifyPasswordFlag: false,
      passwordForm: {
        used: null,
        new: null,
        again: null,
      },
      rules: {
          new: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          again: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          used: [
            { required: true, message: '请填写原密码', trigger: 'blur' }
          ],
        },
      formLabelWidth: "120px",
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$store.commit("SET_USERINFO", null);
        this.$store.commit("SET_TOKEN", null);
        this.$router.push("/login");
      } else if (command == "modifyPassword") {
        this.modifyPasswordFlag = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    modifyClose() {
    this.passwordForm.new = null
    this.passwordForm.again = null
    this.passwordForm.used = null
  },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
  
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
