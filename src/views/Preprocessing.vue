<template>
    <a-layout>
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" style="font-size: 20px;text-align: center;">
        <a-menu-item key="1" @click="changeTo1()">
          <user-outlined />

          <span class="nav-text" >监测界面</span>
        </a-menu-item>
        <a-menu-item key="2" @click="changeTo2()">
          <user-outlined />
          <span class="nav-text">异常查询</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>


    <a-layout v-if="changePage" style="margin: 0px">
      <!-- 标题 -->
      <a-layout-header :style="{ background: '#fff', }" >
           <h1  class="title"> 电磁兼容自动化测试 </h1>
      </a-layout-header>

      <a-layout-content :style="{ margin: '0px 16px 0' }">
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px'}">
        <div class="show_all">

        <div class="show" >
          <img :src="img" style="width: 500px;height: 400px;">
          <span>被检仪表画面</span>
        </div>

        <div class="show_pc" >
          <img :src="img_pc" style="width: 500px;height: 400px;">
        <span>检测软件界面</span>
        </div>

       </div>
        <div class="contain">
          <div  class="txt1" >
          状态指示灯检测结果：{{led}}
      </div>
          <div class="btn">
       <a-button type="primary" @click="start" size="large">{{ bmsg }}</a-button>
      <a-button type="primary" @click="stop" size="large">停止</a-button>
      <a-button type="primary" @click="showModal" size="large"> 手动选框 </a-button>

      </div>

      <a-modal
      title="手动选框"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"

      >
        <div >
           <img :src="img" @click="select($event)" style="width: 500px;height: 400px;">
        </div>

        <template slot="footer" >

          <a-button type="primary" @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </template>

      </a-modal>

    </div>
      </div>

      </a-layout-content>


      <a-layout-footer style="text-align: center">
        中国科学技术大学302实验室
      </a-layout-footer>
    </a-layout>
      <a-layout v-if="!changePage">
        <show></show>>
    </a-layout>
  </a-layout>

</template>

<script>
import axios from 'axios';
import 'ant-design-vue/dist/antd.css';
import Model from 'ant-design-vue';
import Show from './Show.vue';

export default {
    name: "preprocessing",
    data: function () {
        return {
            bmsg: '预览',
            led: "",
            ModalText: "Content of the modal",
            visible: false,
            confirmLoading: false,
            img: require("../assets/R-C.png"),
            isClose: false,
            isopencamera: false,
            selX: 0,
            selY: 0,
            img_pc: require("../assets/dsjj.jpg"),
            changePage:true,
            flag:false,
        };
    },
    methods: {
       changeTo1(){
         this.changePage=true;
       },
      changeTo2(){
         this.changePage=false;
       },
        getImg() {
            var that = this;
          // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
          const path = '/getMsg';
          console.log('发起请求')
          axios.get(path).then(function (response) {
            // 这里服务器返回的 response 为一个 json object，可通过如下方法需要转成 json 字符串
            // 可以直接通过 response.data 取key-value
            // 坑一：这里不能直接使用 this 指针，不然找不到对象
            //console.log('response');

            //console.log(response);
            var msg = response.data
            // 坑二：这里直接按类型解析，若再通过 JSON.stringify(msg) 转，会得到带双引号的字串
            that.img = "data:image/jpeg;base64," + msg['img']
            that.img_pc = "data:image/jpeg;base64," + msg['img_pc']
            that.led = msg['cled']

            if(!that.isClose){
              console.log('msg');
              that.getImg()
            }


          }).catch(function (error) {
            alert('Error ' + error);
          });

        },
        preTosta(){
          var that = this;
          axios.post( '/getMsg', {'preflag':true}).then((response) => {
            console.log(response)
	        })
        },
        start() {
          var that = this;
          if(!that.flag){that.bmsg = '启动'} else{that.bmsg = '已启动'}
          const path = '/getMsg';
          console.log('打开预览摄像头')
          if(that.flag) that.preTosta()
          that.getImg()
          that.change()
          that.flag = true
        },
        change() {
            var that = this;
            that.isClose = false;
        },
        stop() {
            var that = this;
            that.flag = false
            that.bmsg = '预览'
            // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
            var data = { "close": true };
            that.isClose = true;
            console.log("kkk");
            const path = "/close";
            axios.post("/close", { "close": true }).then((response) => {
                console.log(response);
            })
                .catch((error) => {
                console.log("出错了");
                console.log(error);
            });
        },
        showModal() {
            this.visible = true;
        },
        handleOk(e) {
            var that = this;
            that.confirmLoading = true;
            setTimeout(() => {
                that.visible = false;
                that.confirmLoading = false;
            }, 1000);
            // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
            var data = { "selX": that.selX, "selY": that.selY };
            axios.post("/select", data).then((response) => {
                console.log(response);
            })
                .catch((error) => {
                console.log("出错了");
                console.log(error);
            });
        },
        handleCancel(e) {
            console.log("Clicked cancel button");
            this.visible = false;
        },
        select(event) {
            this.selX = event.offsetX;
            this.selY = event.offsetY;
            console.log("坐标点位置");
            console.log(this.selX);
            console.log(this.selY);
        }
    },
}
</script>

<style scoped>
/deep/.ant-tabs .ant-tabs-left-bar .ant-tabs-tab{
  width: 200px;
  text-align: center;
  height: 50px;
  font-size: 20px;

}
/deep/.ant-tabs .ant-tabs-left-content, .ant-tabs .ant-tabs-right-content{
  background-color: white;
}

.show_all{

  position:relative;
  width: 95%;
  height:500px;
  font-weight: bold;
  font-size: 20px;
  align-content: center;
  text-align:center;
  margin: 0%;
  /* left:10%; */
  /* top:80px; */
  border: 2px black solid;
  min-width: 1100px;
  display: inline-block;
}
.show{

  width: 500px;
  height: 400px;
  float: left;
  //border: 1px red solid;
  margin-top: 50px;

}
.show_line
{
  width: 200px;
  height: 500px;
  float: left;
  margin-top: 150px;
  /* //border: 1px red solid; */
}
.show_pc{
  margin-right: 5%;
  width: 400px;
  height: 400px;
  float: right;
  //border: 1px red solid;
    margin-top: 50px;
  min-width: 450px;

}
.text{
  position: relative;
  width: 100%;
  top:-10px;
  font-weight: bold;
  font-size: 20px;
  align-content: center;
  text-align:center;
  left:600px;
  min-width: 1200px;

}
.contain
{
    background-color:rgb(65, 64, 71);
    width: 95%;
    height: 80px;
    width: 1100px;
}

.txt1
{
   margin-top: 20px;
   margin-left: 50px;
   color: aliceblue;
   font-size:20px;
   float: left;
   font-weight: 500;

}

.btn{
  position: relative;
  font-weight: bold;
  font-size: 20px;
  text-align:right;
  float: right;
  margin-right: 50px;
  margin-top: 20px;
}

.title
{
      color:#000000;
      text-align: center;
      font-size:45px;
      font-weight: 600;

}

</style>
