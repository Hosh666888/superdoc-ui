<template>
  <div>
    <el-dialog
        :title="title"
    >
asdaada
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserGroupModifier",
  created() {
    if (this.data == null || this.data.id === undefined || this.data.id === null) {
      this.title = "新增用户组"
    }
  },
  data() {
    return {
      title: '编辑用户组'
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          "id": null,
          "name": "",
          "users": [
            {}
          ],
          "remark": ""
        }
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>