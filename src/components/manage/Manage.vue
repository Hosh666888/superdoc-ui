<template>
  <div id="manage-container">
    <el-tabs tab-position="left">
      <el-tab-pane label="系统信息">
        <SystemInfo/>
      </el-tab-pane>
      <el-tab-pane label="用户">
        <UserControl/>
      </el-tab-pane>
      <el-tab-pane label="用户组">
        <UserGroupControl/>
      </el-tab-pane>
      <el-tab-pane label="仓库">
        <RepoControl/>
      </el-tab-pane>
      <el-tab-pane label="仓库授权">
        <RepoAuth/>
      </el-tab-pane>
      <el-tab-pane label="文档授权">
        <DocAuth/>
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
  components: {
    DocAuth,
    RepoAuth,
    RepoControl,
    UserGroupControl,
    UserControl,
    SystemInfo
  },
  methods: {}
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