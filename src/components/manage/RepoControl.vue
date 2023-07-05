<template>
  <div id="repo-control-container">
    <div>
      <el-form :inline="true" class="search-form"
               border
      >
        <el-form-item label="库名">
          <el-input v-model="searchCondition.repoName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRepoList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openEditDialog(null)">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table :data="repoList" style="width: 100%;min-height: 500px;max-height: 500px" border>
        <el-table-column prop="name" label="名称" width="120" fixed/>
        <el-table-column prop="desc" label="描述" width="300"/>
        <el-table-column prop="createBy" label="创建人" width="120"/>
        <el-table-column prop="createTime" label="创建时间" width="160"/>
        <el-table-column prop="updateBy" label="更新人" width="120"/>
        <el-table-column prop="updateTime" label="更新时间" width="160"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" link type="warning" @click="openEditDialog(scope.row)">修改</el-button>

            <el-popconfirm
                width="200"
                :title="'确定删除仓库('+scope.row.name +')吗?'"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="deleteItem(scope.row.id)">
              <template #reference>
                <el-button size="small" link type="danger">删除</el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-area">
      <el-pagination
          v-model:current-page="searchCondition.pageIndex"
          v-model:page-size="searchCondition.pageSize"
          :page-sizes="[5, 10, 50, 100]"
          small
          layout="total,sizes,prev, pager, next"
          :total="searchCondition.total"
          @size-change="pageSizeChanged"
          @current-change="handlePageChange"
      />
    </div>

    <div id="add-repo-container">
      <el-dialog
          :title="dialogTitle"
          v-model="dialogVisible"
          width="30%"
      >
        <el-form :model="dialogTempData" label-width="120px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogTempData.name"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" max-length="50" show-word-limit v-model="dialogTempData.desc"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RepoApi from "@/api/RepoApi";
import NotifyUtil from "@/utils/NotifyUtil";

export default {
  name: "RepoControl",
  created() {
    this.getRepoList()
  },
  data() {
    return {
      searchCondition: {
        repoName: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      repoList: [],
      dialogVisible: false,
      dialogTempData: {},
      dialogTitle: '新增仓库',
      dialogInAddMode: true,
    }
  },
  methods: {
    getRepoList() {
      RepoApi.getRepoList(this.searchCondition.repoName, this.searchCondition.pageIndex - 1, this.searchCondition.pageSize)
          .then(res => {
            let code = res.data.code
            if (code === 0) {
              this.repoList = []
              let content = res.data.data.content
              for (let item of content) {
                this.repoList.push(item)
              }
              this.searchCondition.pageIndex = res.data.data.number + 1
              this.searchCondition.pageSize = res.data.data.size
              this.searchCondition.total = res.data.data.totalElements
            } else {
              NotifyUtil.warning("获取仓库分页信息", res.data.message)
            }
          }).catch(err => {
        NotifyUtil.error("获取仓库分页信息", err)
      })
    },
    pageSizeChanged() {
      this.searchCondition.pageIndex = 1
      this.getRepoList();
    },
    handlePageChange(currentPage) {
      this.searchCondition.pageIndex = currentPage;
      this.getRepoList();
    },
    saveOrUpdate() {
      let p = null;
      if (this.dialogInAddMode) {
        p = RepoApi.addRepo(this.dialogTempData)
      } else {
        p = RepoApi.updateRepo(this.dialogTempData)
      }

      p.then(res => {
        let code = res.data.code
        if (code === 0) {
          NotifyUtil.success(this.dialogTitle, '操作成功')
          this.getRepoList()
          this.dialogVisible = false
        } else {
          NotifyUtil.warning(this.dialogTitle, res.data.message)
        }
      }).catch(err => NotifyUtil.error(this.dialogTitle, err))

      this.dialogTempData = {}

    },
    deleteItem(repoId) {
      RepoApi.deleteRepo(repoId).then(res => {
        let code = res.data.code
        if (code === 0) {
          NotifyUtil.success('删除仓库', '成功')
          this.getRepoList()
        } else {
          NotifyUtil.warning('删除仓库', res.data.message)
        }
      }).catch(err => NotifyUtil.error("删除仓库", err))
    },
    openEditDialog(row) {
      this.dialogVisible = true
      if (row === null) {
        this.dialogTempData = {
          id: null,
          name: null,
          desc: null
        }
        this.dialogTitle = '新增仓库'
        this.dialogInAddMode = true
      } else {
        this.dialogTempData = {
          id: row.id,
          name: row.name,
          desc: row.desc
        }
        this.dialogTitle = '修改仓库信息'
        this.dialogInAddMode = false
      }
    }


  }
}
</script>

<style scoped>
#repo-control-container {
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