<template>
  <div class="wrapper">
    <div class="left-wrapper">
          <div class="upimg-dragger">
            <a-upload-dragger
              name="file"
              action="/tools/ocr_text/"
              @change="handleChange"
              accept=".jpg, .jpeg, .png, .gif, .ico"
              :beforeUpload="beforeUpload"
              listType="picture"
              :showUploadList="false"
            >
              <p>点击、拖动、或者粘贴图片</p>
            </a-upload-dragger>
          </div>
          <div class="up-img-preview">
            <!--  -->
            <img :src="upImage" alt="预览图片" :hidden="previewImgHidden" style="width: 500px;height: 500px;object-fit: contain"/>
          </div>
        </div>
    <div class="split">
          <div class="divider"></div>
          <div class="btn-group">
            <a-button @click="handleUpload" :loading="isOCRing">识别</a-button>
            <div style="margin-top:1rem;">
              <p>
                压缩图片:
                <a-switch
                  style="width:auto;min-width:45%;"
                  checked-children="开"
                  un-checked-children="关"
                  default-checked
                  @change="changeCompressBtn"
                />
              </p>
              <p :hidden="hiddenCompressBox">
                压缩尺寸:
                <a-input-number
                  style="width:auto;max-width:45%;"
                  id="compressSizeInput"
                  size="small"
                  v-model="comporessSize"
                  :min="1"
                />
                <!-- @change="onChange" -->
              </p>
            </div>
          </div>

        </div>
    <div class="right-wrapper">
          <div class="detected-img" :hidden="hiddenDetectedImg">
            <p>文字检测结果</p>
            <img :src="detectedImg" alt="检测结果图片" style="width: 500px;height: 500px;object-fit: contain"/>
          </div>
      <div class="ocr-raw" :hidden="hiddenOcrRaw">
        <a-divider orientation="left">原始结果</a-divider>
            <CodeHighlight :txt="ocrRaw" />
      </div>

          <div class="ocr-text" :hidden="hiddenOcrText">
            <a-divider orientation="left">识别的文字</a-divider>
            <CodeHighlight :txt="ocrText" />

          </div>
        </div>
  </div>

</template>

<script>
import Vue from 'vue'
import axios from "axios";
 //const axios = require('axios')
import CodeHighlight from '../components/CodeHighlight.vue'
import Message from 'ant-design-vue'
Vue.use(Message)

// 获取上传对象的临时链接
function getObjectURL(file) {
  var url = null
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: 'Index',
  data: function() {
    return {
      upImage: '', // 上传后的图片预览地址
      fileList: [], // 上传图片的列表
      detectedImg: '', // 检测后的图片
      ocrRaw: ``, // 返回的原始结果
      ocrText: ``, // 经过提取后的文字结果

      uploading: false, //状态 原生 上传控件的状态
      previewImgHidden: true, // 状态 预览图片是否隐藏
      isOCRing: false, // 状态 是否在识别中
      hiddenDetectedImg: true, //状态  是否显示检测后的图片
      hiddenOcrRaw: true, // 状态  是否显示返回的原始结果
      hiddenOcrText: true, // 状态 是否显示经过提取后的文字结果
      comporessSize: 1600,
      hiddenCompressBox:false
    }
  },
  components: {
    CodeHighlight
  },
  methods: {
    changeCompressBtn(checked) {

      if(checked === true){
        this.$data.hiddenCompressBox = false
      }
      else{
        this.$data.hiddenCompressBox = true
      }
    },
    handleChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        this.$data.fileList = [info.file]
        this.$data.upImage = getObjectURL(info.file)
        this.$data.previewImgHidden = false
        console.log('success')
      }
      if (status === 'done') {
        console.log('done')
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
        console.log('error')
      }
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    blobToBase64(blob) {
       return new Promise((resolve, reject) => {
         const fileReader = new FileReader();
         fileReader.onload = (e) => {
           resolve(e.target.result);
         };
         // readAsDataURL
         fileReader.readAsDataURL(blob);
         fileReader.onerror = () => {
           reject(new Error('文件流异常'));
         };
       });
   },

    handleUpload({fileList}) {

      if (this.fileList.length < 1) {
        this.$message.warning('还没有选择图片')
        return
      }


      this.isOCRing = true
      this.uploading = true

      const _this = this
      console.log('......');
      console.log(this.upImage);

      const image = new Image() // 新建一个img标签（还没嵌入DOM节点)
      //blob:http://localhost:8080/b878edea-e649-4f8d-b723-c3f25454141b
      image.src = this.upImage;
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height);
        let imgUrl = canvas.toDataURL() //图片的base64地址
        console.log(imgUrl);
        imgUrl=imgUrl.replace(/data.+?;base64,/, "");
        var data= {'charimg':imgUrl}
        axios.post( '/ocr' ,data).then((response) => {
            //console.log('出错了');
            console.log('oooooooooooooo');
            console.log(response);
            _this.detectedImg= response.data['data']['img_detected']
            // _this.$data.ocrText = response.data['data']['ocrText']
            _this.ocrRaw= response.data['data']['raw_out']
            _this.isOCRing=false
            _this.$data.ocrRaw = ''
            let nextLineHeight = 0 // 下一行的高度
          _this.$data.ocrText = ''
          const raw_data = response.data['data']['raw_out']
          for (let i = 0; i < raw_data.length; i++) {
            _this.$data.ocrRaw += JSON.stringify(raw_data[i]) + '\r'

            // 合并同一行的数据
            if (i < raw_data.length - 1) {
              nextLineHeight = raw_data[i + 1][0][1]
              // 判断判断同一行的依据是 两段的行高差 小于 行高的一半
              if (
                Math.abs(raw_data[i][0][1] - nextLineHeight) <
                raw_data[i][0][3] / 2
              ) {
                _this.$data.ocrText += raw_data[i][1] + ' '
              } else {
                _this.$data.ocrText += raw_data[i][1] + '\r'
              }
            } else {
              _this.$data.ocrText += raw_data[i][1]
            }

            // _this.$data.ocrText += raw_data[i][1] + '\r'
          }

          _this.$data.uploading = false
          _this.$data.isOCRing = false
          _this.$data.hiddenDetectedImg = false
          _this.$data.hiddenOcrRaw = false
          _this.$data.hiddenOcrText = false

          _this.$message.success(
            '成功! 耗时：' + response.data['data']['speed_time'] + ' 秒'
          )

	        })
        .catch((error) => {
            console.log('出错了');
            console.log(error)
	        })

     }


    }
  },
  watch: {
    fileList: function(newVal, oldVal) {
      if (newVal.length <= 0) {
        this.hiddenDetectedImg = true
        this.hiddenOcrRaw = true
        this.hiddenOcrText = true

        oldVal
      }

    }
  },
  mounted: function() {
    // console.log('mounted')
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered

      const _this = this
      document.addEventListener('paste', function(event) {
        var items = event.clipboardData && event.clipboardData.items
        var file = null
        if (items && items.length) {
          // 检索剪切板items
          for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              file = items[i].getAsFile()
              break
            }
          }
        }

        // console.log(file)
        if (file !== null) {
          _this.$data.fileList = [file]
          _this.$data.upImage = getObjectURL(file)
          _this.$data.previewImgHidden = false
        }
        console.log(_this.$data.fileList)
        // 此时file就是剪切板中的图片文件
      })
    })
  }
}
</script>

<style scoped lang="less">
.wrapper{
  margin-top: 10px;
  width: 100%;
  height: 1500px;
  min-width:1500px;
  position: relative;
  //left:-100px;
}

.left-wrapper{
  width:550px;
  height: 100%;
  float: left;
  margin-left: 50px;
}
.up-img-preview{
  width:auto;
  //border:3px solid yellowgreen;
}
.split{
  margin-left: 20px;
  width: 130px;
  height: 100%;
  float: left;
  //border: 1px solid blue;
}

.right-wrapper{
  margin-left: 20px;
  width: 500px;
  height: 100%;
  //border: 1px solid blue;
  float: left;

}
.detected-img{
  width:100%;
  height: auto;
  object-fit: cover;
  //border: 1px solid yellowgreen;
}
.ocr-raw{
  width:100%;
  height:auto;
}
.ocr-text{
  width:100%;
  height: auto;
}
</style>








