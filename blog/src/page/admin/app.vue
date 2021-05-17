<template>
  <el-container>
  <el-header style="border-bottom:2px solid #ccc">
    <el-row>
        <el-col
          :offset="3"
          :span="18"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <img src="@/assets/1.jpg" alt="" style="height: 40px" @click="gohome">
          
          <el-dropdown @command="setting">
            <span class="el-dropdown-link">
              <el-avatar
                fit="contain"
                shape="square"
                style="width: 40px; heght: 40px"
                :src="userData.avatar"
              ></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>{{ userData.userName }}</el-dropdown-item>
              <el-dropdown-item command="signout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
        </el-col>
      </el-row>
  </el-header>
  <el-container>
    <el-aside>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          <i class="el-icon-date"></i>
          <span slot="title">数据总览</span>
        </el-menu-item>
        <el-menu-item index="1">
          <i class="el-icon-s-claim"></i>
          <span slot="title">审核</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-location"></i>
          <span slot="title">举报处理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-s-custom"></i>
          <span slot="title">用户权限管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-s-data"></i>
          <span slot="title">数据库管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import defaultConfig from '@/config/config'
// import identifyService from "@/service/identifyService";
export default {

  data(){
    return{
      userData:JSON.parse(sessionStorage.getItem('userData')),
      activeIndex:"0",
      
    }
  },
  
   watch:{
    $route(){
      console.log(this.$route.path);
      switch (this.$route.path) {
        case '/dataView':
          this.activeIndex = '0';
          break;
        case '/review':
          this.activeIndex = '1';
          break;
        case '/tipoff':
          this.activeIndex = '2';
          break;
        case '/permission':
          this.activeIndex = '3';
          break;
        case '/dbmanager':
          this.activeIndex = '4';
          break;
      }
    }
  },
  methods:{
    setting(cmd){
      switch (cmd) {
        case 'signout':
          this.signout()
          break;
      
        default:
          break;
      }
    },
    signout(){
      sessionStorage.removeItem('Authorization')
     location.href = "./login.html"
    },
    gohome(){
      window.location.replace(`${defaultConfig.hostname}/index.html`)
    },
    handleSelect(index){
      console.log(index);
      if(index !== this.activeIndex){
        switch (index) {
        case "0":
          this.$router.push('/dataview');
          this.activeIndex = "0";
          break;
        case "1":
          this.$router.push('/review');
          this.activeIndex = "1"
          break;
          case "2":
            this.$router.push('/tipoff');
          this.activeIndex = "2"
          break;
          case "3":
            this.$router.push('/permission');
          this.activeIndex = "3"
          break;
          case "4":
            this.$router.push('/dbmanager');
          this.activeIndex = "4"
          break;
      }
      }
    }
  }
}
</script>

<style>

</style>