<template>
  <div id="repo-auth-container">

    <el-form :inline="true" class="search-form">
      <el-form-item label="仓库">
        <el-input v-model="repoName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRepoAuthList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="openRepoAuthModifier(null)">添加</el-button>
      </el-form-item>
    </el-form>

    <div style="min-width: 600px;min-height: 400px;max-height:500px;overflow-y: scroll;scroll-behavior: smooth;">
      <el-collapse v-model="repoAuthList">
        <el-collapse-item :title="item.repoName" v-for="(item,index) in repoAuthList" :name="index" :key="index">

          <el-descriptions :title="item.repoName">
            <el-descriptions-item label="人员">
              <el-tag>{{ userCount(item.authedUserDropDown) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ item.createTime }}</el-descriptions-item>
            <el-descriptions-item label="修改时间">{{ item.updateTime }}</el-descriptions-item>
          </el-descriptions>

          <div style="margin: 10px 20px;display: flex">
            <el-button
                type="warning"
                size="small"
                @click="openRepoAuthModifier(item)">
              修改配置
            </el-button>

            <el-popconfirm
                width="200"
                :title="'确定删除此配置吗?'"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="deleteRepoAuth(item.id)"
            >
              <template #reference>
                <el-button
                    type="danger"
                    size="small">
                  删除配置
                </el-button>
              </template>
            </el-popconfirm>
          </div>

          <div style="display: flex;justify-content: center;">
            <!--          用户组-->
            <el-table
                :data="item.userGroupDropDown"
                border
                style="width: 50%;margin-left: 20px"
            >
              <el-table-column prop="data" label="授权用户组" width="180" fixed/>

              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-popconfirm
                      width="200"
                      :title="'确定移除用户组['+scope.row.data + ']吗?'"
                      confirm-button-text="是"
                      cancel-button-text="否"
                      @confirm="removeUserGroup(item.id,scope.row.id)"
                  >
                    <template #reference>
                      <el-text style="cursor: pointer" type="warning" size="small">移除</el-text>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>


            <!--          剔除用户-->
            <el-table
                :data="item.removedUserDropDown"
                border
                style="width: 50%;margin-left: 20px">
              <el-table-column prop="data" label="剔除用户" width="180" fixed/>

              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-popconfirm
                      width="200"
                      :title="'确定取消剔除[ '+scope.row.data + ']吗?'"
                      confirm-button-text="是"
                      cancel-button-text="否"
                      @confirm="cancelRemove(item.id,scope.row.id)"
                  >
                    <template #reference>
                      <el-text style="cursor: pointer" type="warning" size="small">授权</el-text>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>

            <!--            授权人员-->

            <el-table
                :data="item.authedUserDropDown"
                border
                style="width: 50%;margin-left: 20px"
            >
              <el-table-column prop="data" label="已授权用户" width="180" fixed/>

              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-popconfirm
                      width="200"
                      :title="'确定剔除[ '+scope.row.data + ']吗?'"
                      confirm-button-text="是"
                      cancel-button-text="否"
                      @confirm="remove(item.id,scope.row.id)"
                  >
                    <template #reference>
                      <el-text style="cursor: pointer" type="danger" size="small">剔除</el-text>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>

            </el-table>
          </div>


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
      <el-dialog
          :title="dialogTitle"
          v-model="showDialog"
      >
        <el-form :model="dialogTempData" label-width="120px">
          <el-form-item label="仓库">
            <el-select v-model="dialogTempData.repoId"
                       :diabled="dialogOperateMode===1"
                       clearable
            >
              <el-option v-for="option in repoDropDown"
                         :key="option.label"
                         :label="option.data"
                         :value="option.id"
              />
            </el-select>

          </el-form-item>

          <el-form-item label="用户组">
            <el-select v-model="dialogTempData.userGroupIds"
                       multiple
                       clearable
                       search
                       collapse-tags
                       :max-collapse-tags="1"
                       filterable
            >
              <el-option v-for="(option,i) in userGroupDropDown"
                         :key="i"
                         :label="option.data"
                         :value="option.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="剔除成员">
            <el-select
                v-model="dialogTempData.removeUserIds"
                multiple
                clearable
                collapse-tags
                :max-collapse-tags="1"
                filterable
            >
              <el-option v-for="option in userDropDown"
                         :key="option.label"
                         :label="option.data"
                         :value="option.id"
              />
            </el-select>
          </el-form-item>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="addOrUpdateRepoAuth">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>

  </div>

</template>

<script>
import RepoAuthApi from "@/api/RepoAuthApi";
import NotifyUtil from "@/utils/NotifyUtil";
import RepoApi from "@/api/RepoApi";
import UserApi from "@/api/UserApi";
import UserGroupApi from "@/api/UserGroupApi";

export default {
  name: "RepoAuth",
  created() {
    this.getRepoDropDown()
    this.getUserDropDown()
    this.getUserGroupDropDown()
    this.getRepoAuthList()
  },
  data() {
    return {
      repoName: null,
      repoDropDown: [],
      userDropDown: [],
      userGroupDropDown: [],
      showDialog: false,
      dialogTitle: '',
      dialogOperateMode: 0, //0:add 1:update
      repoAuthList: [
        // {
        //   "id": 0,
        //   "repoId": 0,
        //   "repoName": '仓库名称',
        //   "createBy": "创建人",
        //   "updateBy": "修改人",
        //   "createTime": "2023-07-04 10:45:07",
        //   "updateTime": "2023-07-04 10:45:07",
        //   "userGroupDropDown": [
        //     {
        //       "id": 0,
        //       "data": ""
        //     }
        //   ],
        //   "removedUserDropDown": [
        //     {
        //       "id": 0,
        //       "data": ""
        //     }
        //   ],
        //   "authedUserDropDown": [
        //     {
        //       "id": 0,
        //       "data": ""
        //     }
        //   ]
        // }
      ],
      dialogTempData: {
        id: null,
        repoId: null,
        userGroupIds: [],
        removeUserIds: []
      },
      searchCondition: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
    }
  },
  methods: {
    getRepoAuthList() {
      let data = {
        repoName: this.repoName,
        pageIndex: this.searchCondition.pageIndex - 1,
        pageSize: this.searchCondition.pageSize
      }
      this.repoAuthList = []

      RepoAuthApi.list(data).then(res => {
        let code = res.data.code
        if (code === 0) {
          this.repoAuthList = res.data.data.content
          this.searchCondition.pageIndex = res.data.data.number + 1
          this.searchCondition.pageSize = res.data.data.size
          this.searchCondition.total = res.data.data.totalElements
        } else {
          NotifyUtil.warning('查询仓库授权数据', res.data.message)
        }
      }).catch(err => NotifyUtil.error('查询仓库授权数据', err))

    },
    getRepoDropDown() {
      RepoApi.dropDown(null).then(res => {
        let code = res.data.code
        this.repoDropDown = []
        if (code === 0) {
          let data = res.data.data
          for (let item of data) {
            this.repoDropDown.push({
              label: item.data,
              value: item.id
            })
          }
        } else {
          NotifyUtil.warning('获取仓库下拉列表', res.data.message)
        }
      }).catch(err => NotifyUtil.error('获取仓库下拉列表', err))
    },
    getUserDropDown() {
      UserApi.dropDown(null).then(res => {
        let code = res.data.code
        this.userDropDown = []
        if (code === 0) {
          let data = res.data.data
          for (let item of data) {
            this.userDropDown.push({
              label: item.data,
              value: item.id
            })
          }
        } else {
          NotifyUtil.warning('获取用户下拉列表', res.data.message)
        }
      }).catch(err => NotifyUtil.error('获取用户下拉列表', err))
    },
    getUserGroupDropDown() {
      this.userGroupDropDown = []
      UserGroupApi.dropDown().then(res => {
        let code = res.data.code
        if (code === 0) {
          let data = res.data.data
          for (let item of data) {
            this.userGroupDropDown.push({
              label: item.data,
              value: item.id
            })
          }
        } else {
          NotifyUtil.warning('获取用户组下拉列表', res.data.message)
        }
      }).catch(err => NotifyUtil.error('获取用户组下拉列表', err))
    },
    pageSizeChanged(newPageSize) {
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = newPageSize
      this.getRepoAuthList()
    },
    handlePageChange(newPage) {
      this.searchCondition.pageIndex = newPage
      this.getRepoAuthList()
    },
    userCount(arr) {
      if (arr == null || arr.length < 1) return 0
      return arr.length
    },
    openRepoAuthModifier(vo) {
      if (vo == null) {
        this.dialogTempData = {
          id: null,
          repoId: null,
          userGroupIds: [],
          removeUserIds: []
        }
        this.dialogOperateMode = 0
        this.dialogTitle = "添加仓库认证信息"
      } else {

        let userGroupIds = []
        let removedUserIds = []

        for (let item of vo.userGroupDropDown) {
          userGroupIds.push(item.id)
        }
        for (let item of vo.removedUserDropDown) {
          removedUserIds.push(item.id)
        }
        this.dialogTempData = {
          id: vo.id,
          repoId: vo.repoId,
          userGroupIds: userGroupIds,
          removeUserIds: removedUserIds
        }
        this.dialogOperateMode = 1
        this.dialogTitle = "修改仓库认证信息"
      }
      this.showDialog = true
    },
    deleteRepoAuth(id) {
      RepoAuthApi.deleteById(id).then(res => {
        if (res.data.code === 0) {
          NotifyUtil.success("删除仓库授权配置", '成功')
          this.getRepoAuthList()
        } else {
          NotifyUtil.warning("删除仓库授权配置", res.data.message)
        }
      }).catch(err => NotifyUtil.error('删除仓库授权配置', err))
    },
    cancelRemove(id, userId) {
      RepoAuthApi.littleChange({
        id: id,
        targetId: userId,
        target: "USER",
        operation: "REQUEUE"
      }).then(res => {
        if (res.data.code === 0) {
          NotifyUtil.success("重新授权用户", '成功')
          this.getRepoAuthList()
        } else {
          NotifyUtil.warning("重新授权用户", res.data.message)
        }
      }).catch(err => NotifyUtil.error('重新授权用户', err))
    },
    remove(id, userId) {
      RepoAuthApi.littleChange({
        id: id,
        targetId: userId,
        target: "USER",
        operation: "REMOVE"
      }).then(res => {
        if (res.data.code === 0) {
          NotifyUtil.success("剔除用户", '成功')
          this.getRepoAuthList()
        } else {
          NotifyUtil.warning("剔除用户", res.data.message)
        }
      }).catch(err => NotifyUtil.error('剔除用户', err))
    },
    removeUserGroup(id, userGroupId) {
      RepoAuthApi.littleChange({
        id: id,
        targetId: userGroupId,
        target: "USER_GROUP",
        operation: "REMOVE"
      }).then(res => {
        if (res.data.code === 0) {
          NotifyUtil.success("剔除用户组", '成功')
          this.getRepoAuthList()
        } else {
          NotifyUtil.warning("剔除用户组", res.data.message)
        }
      }).catch(err => NotifyUtil.error('剔除用户组', err))
    },
    addOrUpdateRepoAuth() {
      let r
      if (this.dialogOperateMode === 0) {
        r = RepoAuthApi.add({
          "repoId": this.dialogTempData.repoId,
          "userGroupIds": this.dialogTempData.userGroupIds,
          "removeUserIds": this.removeUserIds
        })
      } else {
        r = RepoAuthApi.modify({
          "id": this.dialogTempData.id,
          "userGroupIds": this.dialogTempData.userGroupIds,
          "removeUserIds": this.removeUserIds
        })
      }

      r.then(res => {
        if (res.data.code === 0) {
          NotifyUtil.success(this.dialogTitle, '成功')
          this.getRepoAuthList()
        } else {
          NotifyUtil.warning(this.dialogTitle, res.data.message)
        }
      }).catch(err => NotifyUtil.error(this.dialogTitle, err))


    },
  }
}
</script>

<style scoped>
#repo-auth-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 5px;
  padding-top: 10px;
}

</style>