<template>
 <div class="contain">
      <h1 class="title">计量之眼-仪表远程读数识别系统</h1>
      <!-- <h2 style="padding-left:200px" class="title2"> 本产品用于在工业生产环境中，智能监控传统指针表的读值状态实现传统模拟表的数字化和智能化改造，以远程综合监控方式替代传统的人工巡检方式  
        </h2> -->

        <a-button type="danger"  @click="Change" size="large" style="margin-top:20%;margin-left: 50%; ">了解更多</a-button>
 </div>
</template>

<script>
import mainPageVue from './mainPage.vue'
export default {
  methods: 
    {
        Change()
        {
            // this.$router.replace(mainPageVue)
        }
    }
}

</script>


<style scoped lang="less">
.contain{
    background-image: url("../assets/home.jpg"); 
    width: 100%;
    height:900px;

}

.title{
      height: 100px;
      line-height: 600px;/*值与父元素高度相等*/
      color:#ffffff;
      text-align: center;
      font-size:50px;
      font-weight: 600;

}
.title2{
      

     // line-height: 600px;/*值与父元素高度相等*/
      color:#ffffff;
      text-align: center;
      font-size:25px;
      font-weight: 450;
     

}

</style>