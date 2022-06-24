<template>
  <a-layout>
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span class="nav-text">功能一</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span class="nav-text">功能二</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span class="nav-text">功能三</span>
        </a-menu-item>
        <a-menu-item key="4">
          <user-outlined />
          <span class="nav-text">功能四</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>


    <a-layout>
      <!-- 标题 -->
      <a-layout-header :style="{ background: '#fff', padding: 200  }" >
           <h1  class="title"> OCR (光学字符识别) 在线自由</h1>
      </a-layout-header>


   <a-row>
    <!-- 左边 -->
    <a-col :span="12"> <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">


            <!-- <div class="clearfix">
              <a-upload
                v-model:file-list="fileList"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card"
                @preview="handlePreview"
              >
                <div v-if="fileList.length < 8">
                  <plus-outlined />
                  <div style="margin-top: 8px">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div> -->


       <a-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload> 




    </div>
      </a-layout-content></a-col>

    <!-- 中间 -->
    <a-col :span="2"> 
    <a-button type="primary" @click="start" size="large" style="margin-top:200px; margin-left:60px">开始识别</a-button>
    </a-col>


    <!-- 右边 -->
    <a-col :span="10">
      <a-layout-content :style="{ margin: '24px 90px 0' }">
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
           
     <div style="margin-left:200px ;" >识别结果如下所示</div>
    <div class="regResult">{{res}}</div> 

      </div>
    
    
    
    </a-layout-content></a-col>
  </a-row>
      <!-- 内容 -->
     

    <!-- 提示 -->
     <a-layout-content :style="{ margin: '24px 16px 0' }">
      <div :style="{ padding: '30px', background: '#fff', minHeight: '100px' }">
      <a-steps :current="0">
          <a-step>
            <!-- <span slot="title">Finished</span> -->
            <template #title>上传文件</template>
            <template #description>
              <span>上传所需要的图片.</span>
            </template>
          </a-step>
          <a-step title="点击识别" description="This is a description." />
          <a-step title="识别成功" description="This is a description." />
      </a-steps>
      </div>
    </a-layout-content>

    

      <a-layout-footer style="text-align: center">
        中国科学技术大学302实验室
      </a-layout-footer>
    </a-layout>

  </a-layout>
</template>

<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>



<!-- <template>

  <div class="contain"> 
    <span>请选择待识别的图片</span>
    <div class="upload">
       <a-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload> 

  </div>
    <a-button type="primary" @click="start" size="large" style="margin:30px;">开始</a-button>

    <div>识别结果如下所示</div>
    <div class="regResult">{{res}}</div> 

</div>


</template> -->

<script>
import axios from "axios";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


export default {
  name: "charReg",
   data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [
      ],
      res:""
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;

    },
    async handlePreview(file) {
      console.log("file")
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;

    },
    async handleChange({ fileList }) {
      console.log("fileList1")
      console.log(fileList)
      this.fileList = fileList;
      console.log("fileList2")
      console.log(this.fileList)

      //file =this.fileList[0]
      console.log("this.fileList[0]")
      console.log(this.fileList[0])
      if (!this.fileList[0].url && !this.fileList[0].preview) {
        this.fileList[0].preview = await getBase64(this.fileList[0].originFileObj);
      }
      this.previewImage =this.fileList[0].url || this.fileList[0].preview;
      console.log("charimg1")
      console.log(this.previewImage)
    },
    start(){
      this.previewImage=this.previewImage.replace(/data.+?;base64,/, "");

      var data= {'charimg':this.previewImage}
      console.log("charimg2")
      console.log(this.previewImage)

      axios.post( '/detectChar', data).then((response) => {
            console.log(response)
            this.getresult()
	        })
        .catch((error) => {
            console.log('出错了');
            console.log(error)
	        })
    },
    getresult(){
      var that = this;
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = '/getresult';
      console.log('发起请求')
      axios.get(path).then(function (response) {
            var msg = response.data
            that.res = msg['res']
          }).catch(function (error) {
            alert('Error ' + error);
          })

    },
  },

}
</script>



<style scoped lang="less">
///deep/ .a-upload-dragger{
//  margin: 30px;
//}


.contain{
  margin: 50px;
  align-content: center;
}

.upload{
  width:200px;
  height: 100px;
  margin: 30px;

}
.regResult{
  margin: 30px;
  width: 550px;
  height: 200px;
  border: solid 1px #40a9ff;

}
.ant-upload-select-picture-card i {
  font-size: 50px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

//自己加的
.title
{
      color:#000000;
      text-align: center;
      font-size:45px;
      font-weight: 600;

}
</style>
