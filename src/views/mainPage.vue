<template>
<div>
 <a-tabs style="margin-left:50px " value = "large"   default-active-key="0" >

          <a-tab-pane   key="0" tab="首页" >
           <Home></Home>
          </a-tab-pane>

          <a-tab-pane key="1" tab="电磁兼容自动化测试" >
            <preprocessing></preprocessing>
          </a-tab-pane>

          <a-tab-pane key="2" tab="字符识别" >
            <char-reg></char-reg>
          </a-tab-pane>

          <!-- <a-tab-pane key="3" tab="场景三" >   
            <Show></Show>
          </a-tab-pane> -->


          <template #leftExtra>
            <a-button class="tabs-extra-demo-button">Left Extra Action</a-button>
          </template> 
          <template #rightExtra>
          <a-button>Right Extra Action</a-button>
          </template>
 </a-tabs>
 </div>
</template>

<script>
import Home from "./Home"
import charReg from "./charReg";
import Preprocessing from "./Preprocessing";
import CharReg from "./charReg";
import Show from "./Show"

export default {
  name: "mainPage",
  components: { Home, CharReg, Preprocessing, Show }
}
</script>




<style scoped lang="less">
.tabs-extra-demo-button {
  margin-left: 20px;
}

.ant-row-rtl .tabs-extra-demo-button {
  margin-right: 0;
  margin-left: 16px;
}
</style>
