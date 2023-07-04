<template>
  <div id="manage-container">
    <el-tabs tab-position="left" v-model="activeTab">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.label" :key="tab.label"
                   @click="activeTab = tab.label">
        <component :is="tab.component" v-if="activeTab===tab.label"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SystemInfo from "@/components/manage/SystemInfo";
import UserControl from "@/components/manage/UserControl";
import UserGroupControl from "@/components/manage/UserGroupControl";
import RepoControl from "@/components/manage/RepoControl";
import RepoAuth from "@/components/manage/RepoAuth";
import DocAuth from "@/components/manage/DocAuth";
import UserApi from "@/api/UserApi";
import NotifyUtil from "@/utils/NotifyUtil";

export default {
  name: "Manage",
  created() {
    UserApi.authControlPage().then(res => {
      if (res.data.code !== 0) {
        NotifyUtil.warning("页面检验", "不具备访问权限");
        history.back()
      }
    }).catch(err => {
      NotifyUtil.error(err)
    })
  },
  data() {
    return {
      activeTab: '系统信息',
      tabs: [
        {label: '系统信息', component: SystemInfo},
        {label: '用户', component: UserControl},
        {label: '用户组', component: UserGroupControl},
        {label: '仓库', component: RepoControl},
        {label: '仓库授权', component: RepoAuth},
        {label: '文档授权', component: DocAuth},
      ]
    }
  },
  components: {
    DocAuth,
    RepoAuth,
    RepoControl,
    UserGroupControl,
    UserControl,
    SystemInfo
  }
}
</script>

<style scoped>
#manage-container {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: row;
  gap: 10px;
}

</style>