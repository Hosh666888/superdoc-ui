<template>
  <div id="manage-container">
    <div id="manage-navi">
      <div v-for="item in components" :key="item" class="manage-navi-item"
           :class="{manage_navi_item_checked:currentComponent===item}"
           @click="this.currentComponent = item"
      >
        {{ item }}
      </div>
    </div>
    <div id="manage-box">
      <SystemInfo v-if="currentComponent==='系统信息'"/>
      <UserControl v-else-if="currentComponent==='用户管理'"/>
      <UserGroupControl v-else-if="currentComponent==='用户组管理'"/>
      <RepoControl v-else-if="currentComponent==='仓库管理'"/>
      <RepoAuth v-else-if="currentComponent==='仓库授权'"/>
      <DocAuth v-else-if="currentComponent==='文档授权'"/>
    </div>
  </div>
</template>

<script>
import SystemInfo from "@/components/manage/SystemInfo";
import UserControl from "@/components/manage/UserControl";
import UserGroupControl from "@/components/manage/UserGroupControl";
import RepoControl from "@/components/manage/RepoControl";
import RepoAuth from "@/components/manage/RepoAuth";
import DocAuth from "@/components/manage/DocAuth";

export default {
  name: "Manage",
  created() {
  },
  data() {
    return {
      currentComponent: "系统信息",
      components: [
        "系统信息",
        "用户管理",
        "用户组管理",
        "仓库管理",
        "仓库授权",
        "文档授权"
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

  },
  methods: {}
}
</script>

<style scoped>
#manage-container {
  width: 100vw;
  height: calc(100vh - 50px);
}

#manage-navi {
  max-width: 120px;
  min-width: 70px;
  /*height: 100%;*/
  padding: 10px 2px;

  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 10px 10px;

}

.manage-navi-item {
  font-size: 1.1em;
  font-weight: bolder;
  width: 100%;
  padding: 5px 0;
  cursor: pointer;
  transition: all ease 1s;
}

.manage-navi-item:hover {
  background-color: #2c3e50;
  color: #e6dfdf;
}

.manage_navi_item_checked {
  background-color: #2c3e50;
  color: #e6dfdf;
}


#manage-box {

}

</style>