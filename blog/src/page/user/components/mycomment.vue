<template>
  <div>
    <el-card>
      <div
        slot="header"
        class="clearfix"
        style="display: flex; padding: 0px 16px; justify-content: space-between"
      >
        <h4 style="line-height: 68px; margin: 0px">{{ title }}</h4>
        <div>
          <el-avatar :src="avatar" style="float: right"></el-avatar>
          <br />
          <span style="font-size: 12px; color: blue">{{ userName }}</span>
        </div>
      </div>
      <div v-for="(commentitem, index) of commentlist" :key="index"
      >
        <el-row>
          <el-col :span="1">
              <el-avatar :src="commentitem.userData.avatar" ></el-avatar>
              <p style="font-size: 12px; color: blue;">{{commentitem.userData.userName}}</p>
          </el-col>
          <el-col :span="16" style="box-shadow: 0px 0px 6px 0px #ccc inset;
                 height:44px;line-height:44px; font-size:14px;
                  text-indent: 2em;
                  border-radius:10px;">
              {{commentitem.content}}
          </el-col>
          <el-col :span="1" :offset="2">
              <el-button type="text" @click="goArticleDetail(commentitem.blogId)">详情>></el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-pagination
      layout="prev,pager,next"
      :page-size="params.limit"
      :total="totalNum"
      @current-change="changepage"
    >
    </el-pagination>
  </div>
</template>

<script>
import UserDetailService from "@/service/UserDetailService";
export default {
  data() {
    return {
      commentlist: [],
      params: {
        offset: 0,
        limit: 1,
      },
      totalNum: 0,
      title: "",
      avatar: "",
      userName: "",
    };
  },
  created() {
    this.getcomment();
  },
  methods: {
    changepage(page) {
      this.params.offset = page - 1;
      this.getcomment();
    },
    getcomment() {
      UserDetailService.getComment(this.params).then((rs) => {

        let blogData = rs.data.data.commentlist[0].blogData;
        this.totalNum = rs.data.data.totalNum;
        this.commentlist = rs.data.data.commentlist[0].commentData;
        this.title = blogData.title;
        this.avatar = blogData.author.avatar;
        this.userName = blogData.author.userName;
      });
    },
    goArticleDetail(blogId){
        this.$router.push(`/article-detail/${blogId}`)
    }
  },
};
</script>

<style>
</style>