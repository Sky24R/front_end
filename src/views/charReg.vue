<template>
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
<!--    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">-->
<!--      <img alt="example" style="width: 100%" :src="previewImage" />-->
<!--    </a-modal>-->

    </div>
    <a-button type="primary" @click="start" size="large" style="margin:30px;">开始</a-button>

    <div>识别结果如下所示</div>
    <div class="regResult">{{res}}</div>

  </div>


</template>

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
  width: 200px;
  height: 100px;
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

</style>
