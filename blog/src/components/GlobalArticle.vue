<template>
  <div @click="goArticleDetail">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <span>{{ articleData.title }}</span>
        <el-tag type="warning" v-if="!articleData.approved">未审核</el-tag>
      </div>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-image :src="articleData.cover"></el-image>
          <div class="image-slot" slot="“placeholder">
            加载中<span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p>{{articleData.description}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-avatar :src="articleData.author.avatar" size="small"></el-avatar>
        </el-col>
        <el-col :span="4">
          <p>{{articleData.lastModified|transformTime}}</p>
        </el-col>
        <el-col :span="4">
          <p>{{articleData.author.userName}}</p>
        </el-col>
        <el-col :span="6" :offset="6" style="display: flex;justify-content:space-between">
          <el-badge :value="articleData.likes" class="item">
            <el-button size="small">喜欢</el-button>
          </el-badge>
          <el-badge :value="articleData.views" class="item" type="primary">
            <el-button size="small">阅览</el-button>
          </el-badge>
          <el-badge :value="articleData.comment.length" class="item" type="warning">
            <el-button size="small">回复</el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template> 

<script>
export default {
    props:{
        articleData:{
            type: Object,
            default(){
                return{
                    title:"",
                    tags:[],
                    description:"",
                    cover: "",
                    comment:[],
                    author:{},
                    lastModified:new Date(),
                    views:0,
                    likes:0,
                    approved:true,
                    blogId:0
                }
            }
        }
    },
    filters:{
        transformTime(time){
            let blogcreateTime = new Date(time);
            let currentTime = new Date();
            let offsetTime = currentTime - blogcreateTime;
            let offsetST = offsetTime/1000;
            let offsetMT = offsetST/60;
            let offsetHT = offsetMT/60;
            let offsetDT = offsetHT/24;
            if(offsetDT>= 365){
                return `发表于${Math.floor(offsetDT/365)}年之前`
            }else if(offsetDT >=30&&offsetDT <365){
                return `发表于${Math.floor(offsetDT/30)}月之前`
            }else if(offsetDT >=7&&offsetDT <30){
                return `发表于${Math.floor(offsetDT/7)}周之前`
            }else if(offsetDT >=1&&offsetDT <7){
                return `发表于${Math.floor(offsetDT)}天之前`
            }else if(offsetHT >=1){
                return `发表于${Math.floor(offsetHT)}小时之前`
            }else if(offsetMT >=1){
                return `发表于${Math.floor(offsetMT)}分钟之前`
            }else if(offsetST >=1){
                return `发表于${Math.floor(offsetST)}秒钟之前`
            }
        }
    },
    methods:{
      goArticleDetail(){
        this.$router.push(`/article-detail/${this.articleData.blogId}`)
      }
    }
};
</script>

<style>

</style>