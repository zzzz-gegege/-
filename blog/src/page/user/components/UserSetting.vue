<template>
  <div>
      <el-form>
           <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                name="avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess">
                <img v-if="userData.avatar" :src="userData.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户信息简介" >
              <el-input v-model="userData.introduction" placeholder="请输入用户简介"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button type="danger" @click="resetForm">重置</el-button>
            </el-form-item>
      </el-form>
  </div>
</template>

<script>
import defaultConfig from '@/config/config';
import identifyService from "@/service/identifyService";
export default {
    props:{
        isshowsetting:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            userData:{
                avatar:"",
                introduction:''
            },
            defaultConfig
        }
    },
    methods:{
        handleAvatarSuccess(rs){
            this.userData.avatar = rs.data.imgList[0]
        },
        submitForm(){
            identifyService.UserInfoSetting(this.userData).then(rs =>{
                if(rs.data.status ===200){
                    this.$message.success("更新成功");
                    this.isshowsetting = false;
                    this.$router.go(0) 
                }
            })
        },
        resetForm(){
            for (const key in this.userData) {
                this.userData[key] = ''
            }
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>