<template>
  <div id="user-group-control-container">

    <div class="user-group-search-container">
      <el-form :inline="true" class="search-form">
        <el-form-item label="组名">
          <el-input v-model="groupName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserGroupList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openUserGroupModifier(null)">添加</el-button>
        </el-form-item>
      </el-form>
    </div>


    <div style="min-width: 600px;min-height: 500px;max-height:500px;overflow-y: scroll;scroll-behavior: smooth;">
      <el-collapse v-model="userGroupList">
        <el-collapse-item :title="item.name" v-for="(item,index) in userGroupList" :name="index" :key="index">

          <el-descriptions :title="item.name">
            <el-descriptions-item label="人员">
              <el-tag>{{ userCount(item.users) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ item.createTime }}</el-descriptions-item>
            <el-descriptions-item label="修改时间">{{ item.updateTime }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{ item.remark }}</el-descriptions-item>
          </el-descriptions>

          <div style="margin: 10px 20px;display: flex">
            <el-button
                type="warning"
                size="small"
                @click="openUserGroupModifier(item)">
              修改信息
            </el-button>

            <el-popconfirm
                width="200"
                :title="'确定删除用户组: '+item.name + '吗?'"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="deleteUserGroup(item.id)"
            >
              <template #reference>
                <el-button
                    type="danger"
                    size="small">
                  删除用户组
                </el-button>
              </template>
            </el-popconfirm>
          </div>

          <el-table
              :data="item.users"
              border
              style="width: 50%;margin-left: 20px"
          >
            <el-table-column prop="data" label="用户名" width="180" fixed/>

            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-popconfirm
                    width="200"
                    :title="'确定移除用户 '+scope.row.data + '吗?'"
                    confirm-button-text="是"
                    cancel-button-text="否"
                    @confirm="removeUserFromGroup(item.id,scope.row.id)"
                >
                  <template #reference>
                    <el-text style="cursor: pointer" type="warning" size="small">移除</el-text>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

        </el-collapse-item>
      </el-collapse>
    </div>

    <el-pagination
        :current-page="searchCondition.pageIndex"
        :page-size="searchCondition.pageSize"
        :page-sizes="[5, 10, 30, 50]"
        small
        layout="total,sizes,prev, pager, next"
        :total="searchCondition.total"
        @size-change="pageSizeChanged"
        @current-change="handlePageChange"
    ></el-pagination>

    <div class="dialogs">
      <!--      新增用户至用户组-->
      <!--      新增用户组-->
      <el-dialog
          :title="addUser2GroupDialogTitle"
          v-model="showAddUser2GroupDialog"
      >
        <el-form :model="newUserGroupForm" label-width="120px">
          <el-form-item label="组名" prop="username">
            <el-input clearable v-model="newUserGroupForm.name"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="nickname">
            <el-input type="textarea" show-word-limit maxlength="50" clearable
                      v-model="newUserGroupForm.remark"></el-input>
          </el-form-item>

          <el-form-item label="成员" prop="users">
            <el-select
                v-model="newUserGroupForm.users"
                multiple
                clearable
                collapse-tags
                :max-collapse-tags="1"
            >
              <el-option
                  v-for="item in userDropDown"
                  :key="item.id"
                  :label="item.data"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddUser2GroupDialog = false">取消</el-button>
            <el-button type="primary" @click="addOrUpdateUserGroup">确定</el-button>
          </div>
        </el-form>

      </el-dialog>
    </div>


  </div>

</template>

<script>
import UserGroupApi from "@/api/UserGroupApi";
import NotifyUtil from "@/utils/NotifyUtil";
import UserApi from "@/api/UserApi";

export default {
  name: "UserGroupControl",
  created() {
    this.getUserGroupList()

    UserApi.dropDown().then(res => {
      let code = res.data.code
      if (code === 0) {
        this.userDropDown = res.data.data
      } else {
        NotifyUtil.warning("删除用户组", res.data.message)
      }
    }).catch(err => NotifyUtil.error("获取用户下拉列表", err))

  },
  data() {
    return {
      groupName: '',
      showAddUser2GroupDialog: false,
      addUser2GroupDialogTitle: '',
      addUser2GroupDialogFlag: 0, //0:add 1:update
      userGroupList: [],
      newUserGroupForm: {
        id: null,
        name: '',
        users: [],
        remark: ''
      },
      searchCondition: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      userDropDown: []
    }
  },
  methods: {
    getUserGroupList() {
      let data = {
        name: this.groupName,
        pageIndex: this.searchCondition.pageIndex - 1,
        pageSize: this.searchCondition.pageSize
      }
      UserGroupApi.getUserGroupList(data).then(res => {
        let code = res.data.code
        if (code === 0) {
          this.userGroupList = []
          let content = res.data.data.content
          for (let item of content) {
            this.userGroupList.push(item)
          }
          this.searchCondition.pageIndex = res.data.data.number + 1
          this.searchCondition.pageSize = res.data.data.size
          this.searchCondition.total = res.data.data.totalElements
        } else {
          NotifyUtil.warning('获取用户组列表', res.data.message)
        }
      }).catch(err => {
        NotifyUtil.error("获取用户组列表", err)
      })
    },
    pageSizeChanged(newPageSize) {
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = newPageSize
      this.getUserGroupList()
    },
    handlePageChange(newPage) {
      this.searchCondition.pageIndex = newPage
      this.getUserGroupList()
    },
    removeUserFromGroup(groupId, userId) {
      console.log("移除用户(userGroup)", groupId, userId)
      UserGroupApi.removeUserByUid(groupId, userId).then(res => {
        let code = res.data.code
        let flag = 0
        if (code === 0) {
          NotifyUtil.success("移除用户", "操作成功")
        } else {
          flag = -1
          NotifyUtil.warning("移除用户", res.data.message)
        }
        return flag
      })
          .then(flag => {
            if (flag === 0) {
              for (let item of this.userGroupList) {
                if (groupId === item.id) {
                  item.users = item.users.filter(item => item !== userId)
                }
              }
            }
          })
          .catch(err => NotifyUtil.error("移除用户", err))
    },
    openUserGroupModifier(userGroupVo) {
      if (userGroupVo == null) {
        this.newUserGroupForm = {
          id: null,
          name: '',
          users: [],
          remark: ''
        }
        this.addUser2GroupDialogFlag = 0
        this.addUser2GroupDialogTitle = "新增用户组"
      } else {
        let users = []
        if (userGroupVo.users != null) {
          for (let item of userGroupVo.users) {
            users.push(item.id)
          }
        }

        this.newUserGroupForm = {
          id: userGroupVo.id,
          name: userGroupVo.name,
          users: users,
          remark: userGroupVo.remark
        }
        this.addUser2GroupDialogFlag = 1
        this.addUser2GroupDialogTitle = "更新用户组"
      }

      this.showAddUser2GroupDialog = true
    },
    userCount(users) {
      if (users === null || users === undefined || users === [] || !(users instanceof Array)) return 0
      return users.length
    },
    deleteUserGroup(groupId) {
      console.log("删除用户组", groupId)
      UserGroupApi.deleteUserGroupById(groupId).then(res => {
        let code = res.data.code
        let flag = 0
        if (code === 0) {
          NotifyUtil.success("删除用户组", "操作成功")
        } else {
          NotifyUtil.warning("删除用户组", res.data.message)
          flag = -1
        }
        return flag
      }).then(flag => {
        if (flag === 0) {
          this.getUserGroupList()
        }
      }).catch(err => NotifyUtil.error("删除用户组", err))
    },
    addOrUpdateUserGroup() {
      console.log(this.addUser2GroupDialogFlag === 0 ? "新增组" : "更新组", this.newUserGroupForm)
      if (this.addUser2GroupDialogFlag === 0) {
        UserGroupApi.addUserGroup(this.newUserGroupForm).then(res => {
          let code = res.data.code
          if (code === 0) {
            NotifyUtil.success("添加用户组", "成功")
            this.getUserGroupList()
          } else {
            NotifyUtil.warning("添加用户组", res.data.message)
          }
        }).catch(err => NotifyUtil.error("添加用户组", err))
      } else if (this.addUser2GroupDialogFlag === 1) {
        UserGroupApi.modifyUserGroup(this.newUserGroupForm).then(res => {
          let code = res.data.code
          if (code === 0) {
            NotifyUtil.success("更新用户组", "成功")
            this.getUserGroupList()
          } else {
            NotifyUtil.warning("更新用户组", res.data.message)
          }
        }).catch(err => NotifyUtil.error("更新用户组", err))
      }

      this.showAddUser2GroupDialog = false

    }

  }

}
</script>

<style scoped>
#user-group-control-container {
  padding-left: 5px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}


</style>