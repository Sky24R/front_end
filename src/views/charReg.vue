<template>
  <div class="contain">
    <div class="left">
      <span>请选择待识别的图片</span>
      <div class="upload">
       <a-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      list-type="picture-card"
      v-model:file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
      class="myupload"

    >
      <div v-if="fileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

    </div>
    </div>
    <div class="mid">
      <a-button type="primary" @click="start" size="large" >开始</a-button>

    </div>
    <div class="right">
      <div>识别结果如下所示</div>
      <div class="regResult">{{res}}</div>
    </div>

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
      fileList: [],
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
      this.previewVisible=true;
      this.previewImage = file.url || file.preview;

    },
    async handleChange({ fileList }) {

      this.fileList = fileList;

      if (!this.fileList[0].url && !this.fileList[0].preview) {
        this.fileList[0].preview = await getBase64(this.fileList[0].originFileObj);
      }
      this.previewImage =this.fileList[0].url || this.fileList[0].preview;

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
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkk")
            that.res = msg['res']
            console.log(that.res)
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
  //margin: 50px;
  align-content: center;
  width: 1050px;
  //border: 1px red solid;
  //text-align: center;
  margin-top: 50px;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  height: 500px;
  //min-width: 900px;

}
.left{
  width: 400px;
  height: 400px;
  margin-left: 5%;
  float: left;
  //border: 1px gray solid;
  text-align: center;

}
.mid{
  width: 50px;
  float: left;
  height: 400px;
  //margin-left: 2%;
  //border: 1px yellow solid;
  align-content: center;
  //margin:0 auto;
  margin-left: 2%;
  margin-right: 2%;
  padding-top: 200px;
  //min-width:50px;

}
.right{
  width: 400px;
  margin-right: 5%;
  //margin-left: 2%;
  float: left;
  //border: 1px blue solid;
  text-align: center;
  height: 400px;
}

.upload{
  width:100%;
  height: 310px;

  margin-top: 10px;
  border: 5px red solid;
}
.regResult{
  margin: 10px;
  //width: 200px;
  height: 310px;
  border: solid 5px #40a9ff;

}

.img{
   object-fit: contain;
}
/deep/.ant-upload.ant-upload-select-picture-card {
  width:100%;
  height: 300px;
  align-content: center;
  text-align: center;
}
/deep/.ant-upload-list-picture-card-container{
   width: 100%;
   height: 300px;
   margin: 0;
   padding: 0;

 }
/deep/.ant-upload-list-picture-card .ant-upload-list-item {
    width: 100%;
    height: 100%;
    margin: 0 ;
    padding: 0;

}
/deep/upload-list-picture-card .ant-upload-list-item-thumbnail img{
    //max-height: 300px;
    //max-width: 100%;
    border: red 4px solid;
}
/deep/ img.ant-upload-list-item-image{

  height: 300px;
  width: 100%;
  //transform: scale(1);
}
</style>
