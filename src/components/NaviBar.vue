<template>
  <div id="navi-bar-container" style="height: auto">
    <div class="navbar-title" @click="$router.push('/')">SuperDoc</div>

    <div v-show="isLogin">
      <el-dropdown>
          <span class="avatar">
            <img :src="userAvatar" alt="User Avatar" style="display: inline-block"/>
          </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="enterSystem">进入系统</el-dropdown-item>
            <el-dropdown-item @click="manageInfo">信息管理</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div v-show="!isLogin">
      <el-button
          type="success"
          link
          @click="toggleLoginPage">
        登录
      </el-button>
    </div>

    <el-dialog
        title="登录"
        v-model="dialogVisible"
        width="30%"
        @close="resetForm"
    >
      <el-form ref="loginForm" :model="loginData" :rules="loginRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginData.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import LocalstorageUtil from "@/utils/LocalstorageUtil";
import NotifyUtil from "@/utils/NotifyUtil";
import User from "@/api/UserApi";

export default {
  name: "NaviBar",
  created() {
    this.userAvatar = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    this.isLogin = LocalstorageUtil.getToken()
  },
  data() {
    return {
      userAvatar: '',
      isLogin: false,
      dialogVisible: false,
      loginFormValid: false,
      loginData: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, message: '用户名长度不能小于4个字符', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    enterSystem() {
      // 进入系统的处理逻辑
      this.$router.push("/repos")
    },
    manageInfo() {
      this.$router.push("/manage")
    },
    logout() {
      User.logout().then(res => {
        let data = res.data
        let code = data.code
        if (code === 0) {
          LocalstorageUtil.clearAll()
          this.isLogin = false
          NotifyUtil.success("注销", "操作成功")
          location.reload()
        } else {
          NotifyUtil.error("注销", data.message)
        }
      }).catch(err => {
        NotifyUtil.error("注销", err.message)
      })

    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {

          User.login(this.loginData).then(res => {
            let data = res.data
            if (data.code === 0) {
              NotifyUtil.success("登录", "登录成功")
              let token = data.data
              LocalstorageUtil.setToken(token)
              this.isLogin = true
              this.dialogVisible = false
            } else {
              NotifyUtil.error("登录", data.message)
              LocalstorageUtil.clearAll()
            }
          }).catch(err => {
            NotifyUtil.error("登录", err.message)
          })
        } else {
          NotifyUtil.warning("登录", "表单验证未通过")
        }
      });
    },
    toggleLoginPage() {
      this.dialogVisible = !this.dialogVisible
    }
  }
}

</script>

<style scoped>
#navi-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-title {
  font-family: "PingFang SC", sans-serif;
  font-size: 24px;
  font-weight: bold;
}

.avatar {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>