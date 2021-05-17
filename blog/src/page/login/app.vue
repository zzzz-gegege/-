<template>
  <div style="width:100vw; height:100vh">
    <el-row style="width:100%; height:100%">
      <el-col :span="6" :offset="3">
        <div class="register" v-if="isLogin" >
          <h1 style="text-align: center;">登录</h1>
          <el-form ref="LoginForm" :model="LoginForm" :rules="rules">
            <el-form-item label="用户名" prop='userName'>
              <el-input v-model="LoginForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop='password'>
              <el-input v-model="LoginForm.password" placeholder="请输密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('LoginForm')">提交</el-button>
              <el-button type="danger" @click="resetForm('LoginForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="float:right;">
              没有账号点击
              <el-button type="primary" @click="switchStatus('LoginForm')">注册</el-button>
          </div>
        </div>
        <div class="login" v-else>
          <h1 style="text-align: center;">注册</h1>
          <el-form ref="registerForm" :model="registerForm" :rules="rules">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                name="avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess">
                <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop='userName'>
              <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop='password'>
              <el-input v-model="registerForm.password" placeholder="请输密码" type="password"></el-input>
            </el-form-item>
            <el-form-item  label="确认密码" prop="configpassword">
              <el-input v-model="registerForm.configpassword" placeholder="请输密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
              <el-button type="danger" @click="resetForm('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="float:right;">
               有账号点击
              <el-button type="primary" @click="switchStatus('registerForm')">登录</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="14" class="bg-img"></el-col>
    </el-row>
  </div>
</template>

<script>
import identifyService from '@/service/identifyService'
import defaultConfig from '@/config/config'
export default {
  name:"LoginPage",
  data(){
    let vm = this;
    function validatorpass(rule,value,cb){
      if(value===''){
        cb(new Error('请输入密码'))
      }else{
        if(vm.registerForm.configpassword){
          vm.$refs.registerForm.validateField('configpassword')
        }
      }
      cb()
    }
    function validatorPass2(rule,value,cb){
      if(value===''){
        cb(new Error('请输入密码'))
      }else if(value !== vm.registerForm.password){
        cb(new Error('两次输入的密码不一样'))
      }
      cb()
    }
    return{
      defaultConfig,
      isLogin:true,
      LoginForm:{
        UserName:'',
        password:''
      },
      registerForm:{
        userName:'',
        password:'',
        configpassword:'',
        avatar:'',
      },
      rules:{
        userName:[
          {
            required: true,
            message:"请输入用户名",
            trigger:'blur'
          },{
            min: 6,
            max: 10,
            message: '用户名长度在6-10个字符之间',
            trigger:'blur'
          }
        ],
        password:[
          {
            validator:validatorpass,
            trigger:'blur'
          },{
            min: 6,
            max: 10,
            message: '用户名长度在6-10个字符之间',
            trigger:'blur'
          }
        ],
        configpassword:[
           {
            validator:validatorPass2,
            trigger:'blur'
          },
          {
            min: 6,
            max: 10,
            message: '密码长度在6-10个字符之间',
            trigger:'blur'
          }
        ]
      }
    }
  },
  methods:{
    switchStatus(formName){
      this.isLogin = !this.isLogin
      for (const key in this[formName]) {
        this[formName][key] = ""
      }
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) =>{
        if(valid){
          this.$message.success('验证成功')
        }else{
          this.$message.error('验证失败');
        }
      });
      if(formName === 'registerForm'){
        
        identifyService.register(this.registerForm).then(rs =>{
          if(rs.data.status === 200){
            this.$message.success('注册成功,请等待审核')
          }else{
            this.$message.error('注册失败')
          }
        })
      }else{
        identifyService.loginService(this.LoginForm).then(rs =>{
          console.log(rs);
          if(rs.data.status === 200){
            this.$message.success('登录成功')
            sessionStorage.setItem('Authorization',rs.headers.authorization);
            window.location.replace(`${defaultConfig.hostname}/index.html`)
          }else if(rs.data.status === 500){
            this.$message.error(rs.data.message)
          }else{
            this.$message.error('用户不存在')
          }
        })
      }
    },
    resetForm(formName){
       for (const key in this[formName]) {
        this[formName][key] = ""
      }
    },
    handleAvatarSuccess(rs){
      console.log('头像上传成功',rs);
      this.registerForm.avatar = rs.data.imgList[0]
    }
  }
}
</script>

<style>
body{
  margin: 0;
}
.bg-img{
  height: 100%;
  background-image:url("../../assets/1.jpg");
  background-size:cover;
  background-position:center;
  float: right !important;
}
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
    width: 178px;
    height: 178px;
    display: block;
  }
</style>