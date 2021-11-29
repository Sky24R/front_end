<template>
  <div >
  <h1 style="position: relative;left: 500px;">计量之眼-仪表远程读数识别系统</h1>
    <div class="show_all">

      <div class="show" >
      <span>被检仪表画面</span>
      <img :src="img" style="width: 500px;height: 400px;">
    </div>
    <div class="show_pc" >
      <span>检测软件界面</span>
      <img :src="img_pc" style="width: 500px;height: 400px;">
    </div>
    </div>
    <div class="btn">
      <div style="width: 100%;margin-bottom: 10px;">状态指示灯检测结果：{{led}} </div>
      <a-button type="primary" @click="start" size="large">启动</a-button>
      <a-button type="primary" @click="stop" size="large">停止</a-button>

      <a-button type="primary" @click="showModal" size="large">
      手动选框
      </a-button>
      <a-modal
      title="手动选框"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"

      >
        <div >
           <img :src="img" @click="select($event)">
        </div>

        <template slot="footer">

          <a-button type="primary" @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </template>

      </a-modal>

    </div>

  </div>

</template>

<script>
import axios from 'axios';
import 'ant-design-vue/dist/antd.css';
import Model from 'ant-design-vue';


export default {
  name: "preprocessing",
  data: function() {
          return {
            led:'',
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
            img :require("../assets/R-C.png"),
            isClose:false,//是否关闭摄像头
            isopencamera:false,//是否打开摄像头
            selX:0,
            selY:0,
            img_pc:require("../assets/dsjj.jpg"),
          }
      },
  methods: {
        getImg(){
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
            var msg = response.data;
            console.log('msg');
            console.log(msg);
            // 坑二：这里直接按类型解析，若再通过 JSON.stringify(msg) 转，会得到带双引号的字串
            that.img = "data:image/jpeg;base64," + msg['img']
            that.img_pc = "data:image/jpeg;base64," + msg['img_pc']
            that.led = msg['cled']

            if(!that.isClose){
              //console.log('msg');
              that.getImg()
            }


          }).catch(function (error) {
            alert('Error ' + error);
          })

        },
        start(){
          var that = this;
          // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
          const path = '/getMsg';
          that.isopencamera = true
          if(that.isopencamera){
            console.log('打开摄像头')

            that.getImg()
          }
          that.isopencamera = false
          console.log('关闭摄像头')

          console.log(that.isopencamera )
        },
        change(){
          var that = this;
          that.isClose =false
        },
        stop(){
          var that = this;
          // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
          var data= {'close':true}
          that.isClose =true
          console.log('kkk');
          const path = '/close';
          axios.post( '/close', {'close':true}).then((response) => {
            console.log(response)
	        })
	        .catch((error) => {
            console.log('出错了');
            console.log(error)
	        })
          setInterval(that.change,1000) //此处逻辑待改进
          console.log('isClose')
          console.log(that.isClose)
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
          var data= {'selX':that.selX,'selY':that.selY}

          axios.post( '/select', data).then((response) => {
            console.log(response)
	        })
	        .catch((error) => {
            console.log('出错了');
            console.log(error)
	        })
        },
        handleCancel(e) {
          console.log('Clicked cancel button');
          this.visible = false;
        },
        select(event){
          this.selX = event.offsetX;
		      this.selY = event.offsetY;
		      console.log("坐标点位置")
          console.log(this.selX)
          console.log(this.selY)

        }
  }

}
</script>

<style scoped>
.show_all{
  position:relative;
  width: 100%;
  height:480px;
  font-weight: bold;
  font-size: 20px;
  align-content: center;
  text-align:center;
  margin: 30px;
  left:150px;
  top:10px;
  //border: 1px red solid;
  min-width: 1200px;
  display: inline-block;
}
.show{
  width: 500px;
  height: 450px;
  float: left;
  //border: 1px red solid;
  margin-right: 50px;
  min-width: 450px;

}
.show_pc{
  width: 500px;
  height: 450px;
  float: left;
  //border: 1px red solid;
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
.btn{
  position: relative;
  width: 100%;
  height:100px;
  font-weight: bold;
  font-size: 20px;
  align-content: center;
  text-align:center;
  top: 10px;
  min-width: 1200px;
  left:0px;
  #border: 1px red solid;
}
/deep/.ant-btn-primary{
  margin-right: 30px;
}


</style>
