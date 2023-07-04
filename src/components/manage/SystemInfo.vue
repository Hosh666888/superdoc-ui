<template>
  <div id="system_info_container">
    <el-descriptions title="配置信息" border>
      <el-descriptions-item label="基础路径" :span="4">{{ info.bathPath }}</el-descriptions-item>
      <el-descriptions-item label="临时路径" :span="4">{{ info.tempPath }}</el-descriptions-item>
      <el-descriptions-item label="最大上传线程数" :span="4">{{ info.maxUploadThreadCount }}</el-descriptions-item>
      <el-descriptions-item label="切片大小" :span="4">{{ info.sliceSize }}</el-descriptions-item>
      <el-descriptions-item label="自动删除临时切片" :span="4">{{ info.autoDeleteTempSlice }}</el-descriptions-item>
      <el-descriptions-item label="日志刷新最大数量" :span="4">{{ info.logFlushMaxCount }}</el-descriptions-item>
      <el-descriptions-item label="日志刷新间隔" :span="4">{{ info.logFlushInterval }}</el-descriptions-item>
      <el-descriptions-item label="资源URL" :span="4">{{ info.resourceUrl }}</el-descriptions-item>
      <el-descriptions-item label="资源位置" :span="4">{{ info.resourceLocation }}</el-descriptions-item>
      <el-descriptions-item label="重置密码" :span="4">{{ info.resetPassword }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import SystemInfoApi from "@/api/SystemInfoApi";
import NotifyUtil from "@/utils/NotifyUtil";

export default {
  name: "SystemInfo",
  created() {
    SystemInfoApi.systemInfo().then(res => {
      let code = res.data.code
      if (code === 0) {
        this.info = res.data.data
      } else {
        NotifyUtil.warning('系统信息', res.data.message)
      }

    }).catch(err => NotifyUtil.error('系统信息', err))
  },
  data() {
    return {
      info: {
        "bathPath": "",
        "tempPath": "",
        "maxUploadThreadCount": 0,
        "sliceSize": 0,
        "autoDeleteTempSlice": false,
        "logFlushMaxCount": 0,
        "logFlushInterval": 0,
        "resourceUrl": "",
        "resourceLocation": "",
        "resetPassword": ""
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
#system_info_container {
  padding-left: 5px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

</style>