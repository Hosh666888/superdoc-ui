<template>
  <div>
    <navi-bar/>
    <router-view/>
  </div>
</template>

<script>

import NaviBar from "@/components/NaviBar";

export default {
  name: 'App',
  components: {
    NaviBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  margin: 0;
  padding: 0;

  --main: #4A90E2;
  --second: #2F7EB8;
  --error: #E85454;
  --warn: #FF9F5F;
  --tip1: #67C23A;

}

</style>
