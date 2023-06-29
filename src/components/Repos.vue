<template>
  <div id="repos-contains">
    <div v-for="(item,index) in repos" :key="index">
      <el-card :body-style="{ padding: '0px' }">
        <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
        />
        <div style="padding: 3px 14px">
          <h3>{{ item.name }}</h3>
          <div style="display: flex;flex-direction: row;justify-content: space-between">
            <div style="max-width: 150px" class="span-wrap">
              {{ item.desc }}
            </div>
            <div>
              <el-button type="primary" text class="button"
                         @click="$router.push({name:'Docs',params:{repoId:item.id}})">进入
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import RepoApi from "@/api/RepoApi";
import NotifyUtil from "@/utils/NotifyUtil";

export default {
  name: "Repos",
  created() {
    this.repos = []
    RepoApi.getMyRepos().then(res => {
      let data = res.data
      if (data.code === 0) {
        this.repos = data.data
      }
    }).catch(err => {
      console.log(err.message)
      NotifyUtil.error(err.message)
    })
  },
  data() {
    return {
      repos: [
        {
          id: 123141411141,
          name: "测试仓库1",
          desc: "asjdakdj贷记卡还是觉得哈吉等哈就是多久啊回到家阿骨打与广大员工的三亚古达达了啊肯定会那可就啥叫看到那"
        },
        {
          id: 15135353252,
          name: "测试仓库2",
          desc: "asjdakdj贷记卡还是觉得哈吉等哈就是多久啊回到家阿骨打与广大员工的三亚古达达了啊肯定会那可就啥叫看到那"
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>
#repos-contains {
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.span-wrap {
  /*display: inline-block;*/
  /*max-width: 100px; !* 设置最大宽度，根据需要进行调整 *!*/
  /*overflow: hidden; !* 超出部分隐藏 *!*/
  /*text-overflow: ellipsis; !* 超出部分显示省略号 *!*/
  /*white-space: nowrap; !* 禁止换行 *!*/

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 最大行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}


</style>