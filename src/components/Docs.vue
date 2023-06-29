<template>
  <div id="docs-contains">

    <div id="tree-container">
      <el-select-v2
          v-model="currentRepo"
          :options="myRepos"
          placeholder="选择仓库"
          autocomplete
          size="small"
          @change="currentRepoChanged"
      />

      <el-tree
          :props="treeProps"
          :data="treeData"
          @node-click="handleTreeNodeClick"
          node-key="id"
          default-expand-all
          hightlight-current
      >
        <template v-slot="{ node, data }">
      <span style="display: inline-block;height: 15px;width: 15px">
        <img :src="data.imgSrc" style="width: 100%;height: 100%;"
             :alt="data.desc">
        {{ node.label }}
      </span>

        </template>
      </el-tree>


    </div>

    <div id="frame-contain">
      <div id="desc-area" style="margin: 2px 5px;">
        <el-drawer
            v-model="drawerVisible"
            :title="currentNode.name"
            placement="rtl"
            :width="drawerWidth"
        >
          <el-descriptions border column="1">
            <el-descriptions-item label="路径">
              <span class="break-word">{{ currentNode.path }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="描述">
              <span class="break-word">{{ currentNode.desc }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="目录">
              <el-switch v-model="currentNode.ifDir" disabled></el-switch>
            </el-descriptions-item>
            <el-descriptions-item label="创建">
              <span class="break-word">{{ currentNode.createBy }} - {{ currentNode.createTime }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="更新">
              <span class="break-word">{{ currentNode.updateBy }} - {{ currentNode.updateTime }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="可写">
              <el-button type="primary" :disabled="!currentNode.canWrite || !currentNode.ifDir">上传</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="可删">
              <el-button type="error" :disabled="!currentNode.canDelete">删除</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="可改">
              <el-button type="warning" :disabled="!currentNode.canModify">编辑</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="可读">
              <el-button type="success" :disabled="!currentNode.canRead">预览</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </el-drawer>
      </div>

      <div id="frame-area">
        <iframe src="" frameborder="0"></iframe>
      </div>

    </div>


  </div>
</template>

<script>


import DocApi from "@/api/DocApi";
import NotifyUtil from "@/utils/NotifyUtil";
import RepoApi from "@/api/RepoApi";

export default {
  name: "Docs",
  created() {
    this.currentRepo = this.$route.params.repoId

    RepoApi.getMyRepos().then(res => {
      let data = res.data
      if (data.code === 0) {
        this.myRepos = []
        for (let item of data.data) {
          this.myRepos.push({
            label: item.name,
            value: item.id
          })
        }
      }
    }).catch(err => {
      NotifyUtil.error(err.message)
    })

    DocApi.getMyDocVO(0).then(res => {
      let data = res.data
      if (data.code === 0) {
        this.treeData.children = wrapTreeNode(data.data, 0)
      } else {
        NotifyUtil.warning(data.message)
      }
    }).catch(err => {
      NotifyUtil.error(err)
    })

  },
  data() {
    return {
      currentRepo: 12345,
      currentNode: {
        id: 0,
        parentId: -1,
        name: 'root',
        path: '',
        extention: "",
        md5: "",
        ifDir: true,
        desc: '根目录',
        createTime: "unknown",
        createBy: "System",
        updateTime: "unknown",
        updateBy: "System",
        canWrite: true,
        canDelete: false,
        canModify: false,
        canRead: true,
        isLeaf: false,
        imgSrc: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        children: []
      },
      myRepos: [
        {
          value: 12345,
          label: "实例仓库"
        }
      ],
      treeProps: {
        label: "name",
        children: "children",
        disabled: "canRead",
        isLeaf: "isLeaf"
      },
      treeData: [
        {
          id: 0,
          parentId: -1,
          name: 'root',
          path: '',
          extention: "",
          md5: "",
          ifDir: true,
          desc: '根目录',
          createTime: "",
          createBy: "System",
          updateTime: "",
          updateBy: "System",
          canWrite: true,
          canDelete: false,
          canModify: false,
          canRead: true,
          isLeaf: false,
          imgSrc: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          children: []
        }
      ],
      drawerVisible: false, // 控制属性信息弹出层的显示
      drawerWidth: '400px'
    }
  },
  methods: {
    handleTreeNodeClick(data) {
      this.currentNode = data
      this.drawerVisible = true; // 打开属性信息弹出层

      if (data.isLeaf || !data.ifDir || (data.children != null && data.children.length > 0) || !data.canRead) {
        // NotifyUtil.warning("不给你查")
        return
      }

      DocApi.getMyDocVO(data.id).then(res => {
        let code = res.data.code
        if (code === 0) {
          data.children = wrapTreeNode(res.data.data, data.id)
        } else {
          NotifyUtil.warning("Doc", "未能获取到子节点数据")
        }
      }).catch(err => {
        NotifyUtil.error(err)
      })


    },
    currentRepoChanged(repoId) {
      this.$router.push({name: "Docs", params: {repoId: repoId}})
    },
  }
}

function wrapTreeNode(myDocVos, parentId) {
  let children = []
  for (let item of myDocVos) {
    children.push({
      id: item.id,
      parentId: parentId,
      name: item.name,
      path: item.path,
      extention: item.extention,
      md5: item.md5,
      ifDir: item.ifDir,
      desc: item.desc,
      createTime: item.createTime,
      createBy: item.createBy,
      updateTime: item.updateTime,
      updateBy: item.updateBy,
      canWrite: item.canWrite,
      canDelete: item.canDelete,
      canModify: item.canModify,
      canRead: item.canRead,
      isLeaf: !item.ifDir,
      imgSrc: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      children: []
    })
  }
  return children
}

</script>

<style scoped>
#docs-contains {
  display: flex;
  flex-direction: row;
  justify-content: left;
  min-height: calc(100vh - 50px);
  width: 100vw;
}

#tree-container {
  min-width: 200px;
  border-right: 1px #e6dfdf solid;
  padding: 8px 10px;
  /*width: auto;*/
}


#frame-contain {
  display: flex;
  flex-direction: row;
  justify-content: left;
}

#desc-area {
  min-width: 100px;
}

.break-word {
  white-space: pre-wrap; /* 自动换行 */
}

.el-descriptions-item__label {
  width: 20px; /* 自定义 label 的宽度 */
}


</style>