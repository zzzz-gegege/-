<template>
  <div @click="keepout">
    <el-container>
      <el-header style="border-bottom: 2px solid #ccc; margin-bottom: 20px">
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
            <img src="@/assets/1.jpg" alt="" style="height: 40px" />
            <el-input
              v-model="Searchkey"
              placeholder="请输入文章标题"
              style="width: 60%"
            >
              <el-button
                type="primary"
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
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
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="signout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-link type="primary" href="login.html" v-if="!hasPermission"
              >登录</el-link
            >
            <el-button
              type="text"
              icon="el-icon-s-home"
              v-if="hasPermission"
              @click="goChathome"
              >小树洞</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              v-if="hasPermission"
              @click="goArticleEdit"
              >写文章</el-button
            >
            <el-button
              type="text"
              icon="el-icon-s-data"
              v-if="isAdmin"
              @click="goAdmin"
              >站点管理系统</el-button
            >
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="240px" v-if="hasPermission">
          <Userinfo :user-data="userData"> </Userinfo>
        </el-aside>
        <el-main>
          <el-tabs v-model="activeName" @tab-click="switchTab">
            <el-tab-pane name="article" label="广场">
              <Community></Community>
            </el-tab-pane>
            <el-tab-pane name="myself" label="我的文章">
              <myblog></myblog>
            </el-tab-pane>
            <el-tab-pane name="like" label="喜欢">
              <mylikes></mylikes>
            </el-tab-pane>
            <el-tab-pane name="comment" label="评论">
              <mycomment></mycomment>
            </el-tab-pane>
            <el-tab-pane name="attention" label="关注">
              <myAttention></myAttention>
            </el-tab-pane>
            <el-tab-pane name="blacklist" label="黑名单"></el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <el-dialog title="更新用户信息" :visible.sync="isShowSetting" width="60%">
        <UserSetting :isshowsetting="isShowSetting"></UserSetting>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import defaultConfig from "@/config/config";
import Community from "@/page/user/components/Community";
import myblog from "@/page/user/components/myBlog";
import mycomment from "@/page/user/components/mycomment";
import mylikes from "@/page/user/components/mylikes";
import identifyService from "@/service/identifyService";
import Userinfo from "@/components/Userinfo";
import myAttention from "@/page/user/components/myAttention";
import UserSetting from "@/page/user/components/UserSetting";
export default {
  name: "home",
  components: {
    Userinfo,
    Community,
    myblog,
    mylikes,
    mycomment,
    myAttention,
    UserSetting,
  },
  data() {
    return {
      Searchkey: "",
      hasPermission: false,
      activeName: "",
      userData: {},
      isShowSetting: false,
      isAdmin: null,
      n: false,
    };
  },
  created() {
    identifyService.AuthorService().then((rs) => {
      if (rs.data.status == 200) {
        this.hasPermission = true;
        this.userData = rs.data.data;
        this.isAdmin = this.userData.isAdmin;
        sessionStorage.setItem("userData", JSON.stringify(this.userData));
      }
      this.activeName = this.$route.params.id
        ? this.$route.params.id
        : "article";
    });
  },
  methods: {
    keepout() {
      if (sessionStorage.getItem("userData")) return
      if(confirm("是否注册账户")){
        window.location.replace(`${defaultConfig.hostname}/login.html`);
      }else{
        alert("请您先注册一个账户");
        window.location.replace(`${defaultConfig.hostname}/login.html`);
      }
    },
    goArticleEdit() {
      this.$router.push("/article-edit");
    },
    switchTab(tab) {
      if (this.$route.params.id === tab.name) return;
      this.$router.push(`/home/${tab.name}`);
    },
    setting(command) {
      switch (command) {
        case "setting":
          this.isShowSetting = !this.isShowSetting;
          break;
        case "signout":
          this.signout();
          break;
      }
    },
    goChathome() {
      this.$router.push("/chathome");
    },
    search() {
      sessionStorage.setItem("SearchKey", this.Searchkey);
      this.$router.push("/Search");
    },
    signout() {
      sessionStorage.removeItem("Authorization");
      window.location.replace(`${defaultConfig.hostname}/login.html`);
    },
    goAdmin() {
      window.location.replace(`${defaultConfig.hostname}/admin.html`);
    },
  },
};
</script>

<style>
.el-link--inner {
  width: 40px;
  margin-left: 20px;
  display: inline-block;
}
</style>