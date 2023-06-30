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

    <div style="min-width: 600px">
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


          <div style="margin: 10px 10px;display: flex">
            <el-button
                type="success"
                size="small"
                @click="openUserGroupModifier(item)">
              添加成员
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
              style="width: 50%;"
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


    <div>
      <el-pagination
          v-model:current-page="pageIndex"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 30, 50]"
          small
          layout="total,sizes,prev, pager, next"
          :total="total"
          @size-change="pageSizeChanged"
          @current-change="handlePageChange"
      ></el-pagination>
    </div>


    <div class="dialogs">
      <!--      新增用户至用户组-->
      <!--      新增用户组-->
      <UserGroupModifier v-if="showAddUser2GroupDialog" :data="addUser2GroupTempGroupData"/>

    </div>


  </div>

</template>

<script>
import UserGroupApi from "@/api/UserGroupApi";
import NotifyUtil from "@/utils/NotifyUtil";
import UserGroupModifier from "@/components/manage/UserGroupModifier";

export default {
  name: "UserGroupControl",
  created() {
    this.getUserGroupList()
  },
  data() {
    return {
      authPass: false,
      groupName: '',
      dialogVisible: false,
      showAddUser2GroupDialog: false,
      userGroupList: [
        // {
        //   "id": 0,
        //   "name": "",
        //   "users": [
        //     {
        //       "id": 0,
        //       "data": ""
        //     }
        //   ],
        //   "createTime": "2023-06-30 16:24:22",
        //   "updateTime": "2023-06-30 16:24:22",
        //   "remark": ""
        // }
      ],
      addUser2GroupTempGroupData: {},
      pageIndex: 1,
      pageSize: 10,
      total: 1
    }
  },
  methods: {
    getUserGroupList() {
      let data = {
        name: this.groupName,
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize
      }
      UserGroupApi.getUserGroupList(data).then(res => {
        let code = res.data.code
        if (code === 0) {
          this.userGroupList = []
          let content = res.data.data.content
          for (let item of content) {
            this.userGroupList.push(item)
          }
          this.currentPage = data.number + 1
          this.pageSize = data.size
          this.total = data.totalElements
        } else {
          NotifyUtil.warning('获取用户组列表', res.data.message)
        }
      }).catch(err => {
        NotifyUtil.error("获取用户组列表", err)
      })
    },
    pageSizeChanged() {
      this.pageIndex = 1
      this.getUserGroupList()
    },
    handlePageChange() {
      this.getUserGroupList()
    },
    removeUserFromGroup(groupId, userId) {
      console.log(groupId, userId)
      NotifyUtil.warning("移除。。。")
    },
    openUserGroupModifier(userGroupVo) {
      this.addUser2GroupTempGroupData = userGroupVo
      this.showAddUser2GroupDialog = true
    },
    userCount(users) {
      if (users === null || users === undefined || users === [] || !(users instanceof Array)) return 0
      return users.length
    },
    deleteUserGroup(groupId) {
      console.log(groupId)
    }

  },
  components: {
    UserGroupModifier
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
}


</style>