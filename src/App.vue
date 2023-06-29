<template>
    <navi-bar style="height: 50px"/>
    <router-view style="margin-top: 50px"/>
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
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: "PingFang SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  --main: #4A90E2;
  --second: #2F7EB8;
  --error: #E85454;
  --warn: #FF9F5F;
  --tip1: #67C23A;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::-webkit-scrollbar{
  width: 0;
  height: 0;
}

body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
}


</style>
