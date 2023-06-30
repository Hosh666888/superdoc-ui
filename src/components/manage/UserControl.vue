<template>
  <div id="user-control-container">
    <div>
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="username" clearable></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="role" clearable>
            <el-option
                v-for="roleItem in roleOptions"
                :key="roleItem.value"
                :label="roleItem.label"
                :value="roleItem.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" clearable>
            <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
          :data="userList"
          border
          style="width: 90%;min-height: 400px"
      >
        <el-table-column prop="username" label="用户名" width="120" fixed/>
        <el-table-column prop="nickname" label="昵称" width="180"/>
        <el-table-column prop="role" label="角色" width="105">
          <template #default="scope">
            <el-tag v-if="scope.row.role==='SUPERADMIN'" type="danger">超级管理员</el-tag>
            <el-tag v-else-if="scope.row.role==='ADMIN'" type="warning">管理员</el-tag>
            <el-tag v-else-if="scope.row.role==='NORMAL'">用户</el-tag>
            <el-tag v-else type="info">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="210"/>
        <el-table-column prop="tel" label="电话" width="120"/>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.status==0" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.status==-1">封禁</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ifOnline" label="在线" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.ifOnline">在线</el-tag>
            <el-tag v-else type="info">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="190"/>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="190"/>
        <el-table-column prop="lastLoginIp" label="最后登录IP" width="120"/>

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="modifyUser" :disabled="scope.row.role==='SUPERADMIN'">
              修改
            </el-button>
            <el-popconfirm
                width="200"
                :title="'确定重置用户 '+scope.row.nickname +'('+scope.row.username+') 的密码吗?'"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="resetPwd(scope.row)"
            >
              <template #reference>
                <el-button link type="warning" size="small" :disabled="scope.row.role==='SUPERADMIN'">
                  重置
                </el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm
                width="200"
                :title="'确定删除用户 '+scope.row.nickname +'('+scope.row.username+')吗?'"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="Delete"
                @confirm="deleteUser(scope.row)">
              <template #reference>
                <el-button style="cursor: pointer;padding: 0 5px" link type="error" size="small"
                           :disabled="scope.row.role==='SUPERADMIN'">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-area">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[2, 10, 50, 100]"
          small
          layout="total,sizes,prev, pager, next"
          :total="total"
          @size-change="pageSizeChanged"
          @current-change="handlePageChange"
      />
    </div>

    <div id="add-user-container">
      <el-dialog
          title="新增用户"
          v-model="dialogVisible"
          width="30%"
      >
        <el-form :model="newUserForm" :rules="formRules" ref="newUserFormRef" label-width="120px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="newUserForm.username"></el-input>
          </el-form-item>

          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="newUserForm.nickname"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="newUserForm.password" type="password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="newUserForm.email" type="email"></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="tel">
            <el-input v-model="newUserForm.tel"></el-input>
          </el-form-item>

          <el-form-item label="角色" prop="role">
            <el-select v-model="newUserForm.role">
              <el-option
                  v-for="option in roleOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="addUser" :loading="addUserLoading">确定</el-button>
      </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import UserApi from "@/api/UserApi";
import NotifyUtil from "@/utils/NotifyUtil";

export default {
  name: "UserControl",
  created() {
    this.getUserList()
  },
  data() {
    return {
      authPass: false,
      userList: [
        // {
        //   "id": 0,
        //   "username": "",
        //   "nickname": "",
        //   "role": "",
        //   "email": "",
        //   "tel": 0,
        //   "createTime": "",
        //   "lastLoginTime": "",
        //   "lastLoginIp": "",
        //   "status": null,
        //   "ifOnline": null,
        //   "token": ""
        // }
      ],
      total: 0,
      username: '',
      nickname: '',
      role: '',
      status: null,
      currentPage: 1,
      pageSize: 10,
      roleOptions: [
        {label: '管理员', value: 'ADMIN'},
        {label: '普通用户', value: 'NORMAL'},
      ],
      statusOptions: [
        {label: '正常', value: 0},
        {label: '封禁', value: -1},
      ],
      dialogVisible: false,
      addUserLoading: false,
      newUserForm: {
        username: '',
        nickname: '',
        password: '',
        email: '',
        tel: null,
        role: 'NORMAL' // 默认选中普通用户
      },
      formRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
        role: [{required: true, message: '请选择角色', trigger: 'change'}]
      },
    }
  },
  methods: {
    pageSizeChanged() {
      this.currentPage = 1
      this.getUserList();
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
      this.getUserList();
    },
    getUserList() {
      let queryData = {
        username: this.username,
        nickname: this.nickname,
        role: this.role,
        status: this.status,
        pageIndex: this.currentPage - 1,
        pageSize: this.pageSize
      }
      UserApi.getUserPageList(queryData).then(res => {
        let code = res.data.code
        let data = res.data.data
        console.log(data)
        if (code === 0) {
          this.userList = []
          let content = data.content
          for (let item of content) {
            this.userList.push(item)
          }
          this.currentPage = data.number + 1
          this.pageSize = data.size
          this.total = data.totalElements
        }
      }).catch(err => {
        console.log(err)
      })
    },
    modifyUser(row) {
      console.log(row)
      NotifyUtil.warning("还没写")

    },
    resetPwd(row) {
      let uid = row.id
      if (uid === null) return
      let msg = `成功重置用户:${row.nickname}(${row.username})的密码`

      UserApi.restPassword(uid).then(res => {
        let code = res.data.code
        if (code === 0) {
          NotifyUtil.success("重置密码", msg)
        } else {
          NotifyUtil.error("重置密码", res.data.message)
        }
      }).catch(err => {
        NotifyUtil.error("重置密码", err)
      })

    },
    deleteUser(row) {
      console.log(row);
      NotifyUtil.warning("还没写")
      //删除

    },
    addUser() {
      this.addUserLoading = true
      let title = '添加用户'
      this.$refs.newUserFormRef.validate(valid => {
            if (!valid) return;
            console.log('表单校验通过，可以提交数据:', this.newUserForm)

            let user = `${this.newUserForm.nickname}(${this.newUserForm.username})`

            UserApi.addUser(this.newUserForm).then(res => {
              let code = res.data.code
              if (code === 0) {
                NotifyUtil.success("添加用户", `成功添加用户${user}`)
                this.dialogVisible = false
              } else {
                NotifyUtil.warning("添加用户", res.data.message)
                this.newUserForm = {}
                return -1
              }
              return 0
            }).then(res => {
              if (res === 0) {
                title = '获取用户列表'
                this.getUserList()
              }
            }).catch(err => {
              NotifyUtil.error(title, err)
              this.newUserForm = {}
            })
          }
      )

      this.addUserLoading = false
    }
  }
}
</script>

<style scoped>

#user-control-container {
  padding-left: 5px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.page-area {
  padding-top: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .search-form {
    flex-direction: column;
  }
}

</style>