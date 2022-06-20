<template>
 <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="电磁兼容自动化测试" >
            <preprocessing></preprocessing>
          </a-tab-pane>
          <a-tab-pane key="2" tab="字符识别" >
            <char-reg></char-reg>
          </a-tab-pane>

 </a-tabs>
</template>

<script>
import charReg from "./charReg";
import Preprocessing from "./Preprocessing";
import CharReg from "./charReg";
export default {
  name: "mainPage",
  components: {CharReg, Preprocessing}
}
</script>

<style scoped lang="less">
/deep/ .a-tabs{
  margin: 30px;
}
</style>
