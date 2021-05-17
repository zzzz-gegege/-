<template>
  <div>
    <el-row v-for="(attention, index) of attentionlist" :key="index"
       style="box-shadow: 0px 0px 6px 0px #ccc inset;border-radius:10px;padding:10px 0 0 10px;"
    >
      <el-col :span="2">
        <el-avatar :src="attention.avatar"></el-avatar>
        <br />
        <span style="font-size: 12px; color: blue">{{
          attention.userName
        }}</span>
      </el-col>
      <el-col :span="8"
      >{{attention.introduction?`个人简介:${attention.introduction}`:`个人简介：无`}}</el-col>
      <el-col :offset="16" style="position:relative;bottom:50px">
        <el-button
          type="primary"
          @click="switchattention(attention.userName)"
          :icon="
            userData.userData.attentions.includes(attention.userName)
              ? 'el-icon-check'
              : 'el-icon-plus'
          "
          >关注</el-button
        >
      </el-col>
    </el-row>
    <el-pagination
      layout="prev,pager,next"
      :page-size="params.limit"
      :total="params.totalNum"
      @current-change="changepage"
    >
    </el-pagination>
  </div>
</template>

<script>
import blogService from "@/service/blogService";
import UserDetailService from "@/service/UserDetailService";
export default {
  data() {
    return {
      attentionlist: [],
      params: {
        offset: 0,
        limit: 5,
        totalNum:0
      },
      userData: JSON.parse(sessionStorage.getItem("userData")),
      totalNum:0
    };
  },
  created() {
    this.getattention()
  },
  methods: {
    switchattention(userName) {
      if(this.userData.userData.attentions.includes(userName)) {
        this.userData.userData.attentions.splice(
          this.userData.userData.attentions.indexOf(userName, 1)
        );
        sessionStorage.setItem("userData", JSON.stringify(this.userData));
        UserDetailService.unattention(userName).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("取消关注成功");
          } else {
            this.$message.error("取消关注失败");
          }
        });
      }else{
           this.userData.userData.attentions.push(userName);
           sessionStorage.setItem("userData", JSON.stringify(this.userData));
           UserDetailService.setattention({
            userName: userName,
        }).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("关注成功");
          } else {
            this.$message.error("关注失败");
          }
        });
      }
    },
    getattention(){
        blogService.myattention(this.params).then((rs) => {
        this.attentionlist = rs.data.data.rs;
        this.params.totalNum = rs.data.data.totalNum
    });
    },
    changepage(page){
        this.params.offset = this.params.offset + (this.params.limit * page)
    }
  },
};
</script>                                               

<style>
/* div{
    position: relative;
} */
</style>