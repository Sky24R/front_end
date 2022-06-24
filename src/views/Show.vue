<template>
  <a-layout>
    <a-layout-header>Header</a-layout-header>

    <!-- ----------------------------------------------------------------------------------------- -->
          <!-- 上面部分 -->
          <a-layout-content >
            <div :style="{ padding: '24px', background: '#fff', minHeight: '100px'  }">
              <a-space size= "large">

                    <a-date-picker id="data" style="margin-left:650px;"  @change="onChange"	@ok="onOk" />
                    <a-time-picker :default-value="moment('12:08:23', 'HH:mm:ss')" size="large"  @change="onChange2" />
                    <a-select default-value="chose_data" style="width: 120px" @change="handleChange">
                        <a-select-option value="chose_data">
                            精确到日
                          </a-select-option>
                        <a-select-option value="chose_time">
                            精确到秒
                          </a-select-option>
                    </a-select>
                    <a-button type="primary" @click="search_button">查询按钮</a-button>


              </a-space>
          </div>
          </a-layout-content>

      <!-- ----------------------------------------------------------------------------------------- -->
        <!-- 图片 -->
        <a-layout-content style="background-color: white">
          <div style="text-align: center;">
            <img id = "show_image" style="" :src="Pic_url" width=500px height=400px  >
          </div>
        </a-layout-content>



    <a-layout-content style="background-color: white">
          <div style="text-align: center;">
            <h1 id="pic_show_name"  style="align-content: center;">2021-11-29/2021-11-29-19-01-36_1.jpg</h1>
          </div>
    </a-layout-content>

    <a-layout-content style="background-color: white">
          <div style="text-align: center;">
            <a-button type="primary"   size="large" @click="pre_button" style="margin-right: 40px;">前一个</a-button>
            <a-button type="primary" size="large" @click="next_button" style=" " >后一个</a-button>
          </div>
    </a-layout-content>
  <!-- ----------------------------------------------------------------------------------------- -->
      <!-- 下面按钮 -->

    <a-layout-footer style="text-align: center;background-color: white">
        中国科学技术大学302实验室
    </a-layout-footer>


  </a-layout>
</template>




<script>
import moment from 'moment';
import { nearer } from 'q';

export default {
  name: "Show",
   data(){
      return{
        Pic_url:require("../assets/img/2021-11-29/2021-11-29-19-01-36_1.jpg"),
        data_value : "",
        time_value: "",
        pic_names : [] ,
        current_index : -1,
        chose_mode:"chose_data"
      }
    },

  methods:{

   moment,

    onChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
          this.$data.data_value =dateString;
    },
    onOk (value) {
      console.log('onOk: ', value)
      this.$data.data_value =value;
    },

     onChange2(time, timeString) {
      console.log(timeString);
          this.$data.time_value =timeString;
    },

   handleChange(value) {
      this.$data.chose_mode = value;
      console.log(`selected ${value}`);
    },

    //前一个按钮
      pre_button(){

          var h1 = document.getElementById("pic_show_name")

          if(this.$data.current_index!=-1)
          {
            if( this.$data.current_index>0)
            {
              this.$data.current_index--;
            }
            else
            {
              this.$data.current_index =    this.$data.pic_names.length-1;
            }
            var data_string = this.$data.data_value;
            var image = document.getElementById('show_image');
            image.src =require(`../assets/img/`+this.$data.pic_names[this.$data.current_index]);

            h1.innerText = this.$data.pic_names[this.$data.current_index]
          }




      },
//后一个按钮
      next_button(){

          var h1 = document.getElementById("pic_show_name")

             if(this.$data.current_index!=-1)
                {
                  if( this.$data.current_index <  this.$data.pic_names.length-1)
                  {
                    this.$data.current_index++;
                  }
                  else
                  {
                    this.$data.current_index =  0;
                  }
                  var data_string = this.$data.data_value;
                  var image = document.getElementById('show_image');
                  image.src =require(`../assets/img/`+this.$data.pic_names[this.$data.current_index]);
                 h1.innerText = this.$data.pic_names[this.$data.current_index]
                }
      },


  // 查询
  search_button(){

          var image = document.getElementById('show_image');
          var data_string = this.$data.data_value;
          var time_string = this.$data.time_value
          var time_string_new =time_string.replaceAll(':','-')
          var h1 = document.getElementById("pic_show_name")


          let pic_string = data_string+"-"+time_string_new+"_0"+".jpg";


        // image.src =require("../assets/img/2021-11-29/2021-11-29-19-01-36_2.jpg");

          console.log(`../assets/img/${data_string}`)

          this.$data.pic_names= [];
          const files = require.context(`../assets/img`, true,/\.jpg$/);
          files.keys().forEach(path=> {
            console.log(path);
            this.$data.pic_names.push(path.substr(2));
          })



          //数据处理
          if(this.$data.chose_mode == "chose_data")
          {
               for (var i = 0; i < this.$data.pic_names.length; i++)
              {
                  if( this.$data.pic_names[i].search(data_string) !=-1)
                  {
                    console.log("找到了")
                    this.$data.current_index = i;
                    break;
                  }
              }

             if(i== this.$data.pic_names.length)
              {
                  this.$data.current_index = -1;
                   h1.innerText ="不存在此照片"
                   image.src=require(`../assets/error.png`);
              }
              else
              {
                  console.log(this.$data.pic_names[this.$data.current_index])
                  image.src =require(`../assets/img/`+this.$data.pic_names[this.$data.current_index]);
                  h1.innerText = this.$data.pic_names[this.$data.current_index]
              }

          }
          else
          {
            // 判断是否拥有
              for (var i = 0; i < this.$data.pic_names.length; i++)
              {
                  if( this.$data.pic_names[i].search(data_string+"-"+time_string_new) !=-1)
                  {
                    console.log("找到了")
                    this.$data.current_index = i;
                    break;
                  }
              }

              if(i== this.$data.pic_names.length)
              {
                  this.$data.current_index = -1;
                   h1.innerText ="不存在此照片"
                  image.src=require(`../assets/error.png`);
              }
              else
              {
                  console.log(this.$data.pic_names[this.$data.current_index])
                  image.src =require(`../assets/img/`+this.$data.pic_names[this.$data.current_index]);
                  h1.innerText = this.$data.pic_names[this.$data.current_index]
              }
          }

  },


  }
}


</script>
