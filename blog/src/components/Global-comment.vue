<template>
  <div>
    <div
      v-for="(commentItem,index) of localcomment"
      :key="index"
      class="comment-card"
      style="margin-bottom: 20px"
    >
      <el-row>
        <el-col :span="2">
          <el-avatar
            :src="commentItem.userData.avatar"
            size="large"
          ></el-avatar>
        </el-col>
        <el-col :span="6">
          <span>{{ commentItem.userData.userName }}</span>
          <br/>
          <span>{{ commentItem.lastModified | transformTime }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">{{ commentItem.content }}</el-col>
        <el-col :span="24">
          <div
            v-for="(soncommentItem,index) of commentItem.comment"
            :key="index"
            style="margin-top: 20px"
          >
            <el-row style="padding-left:20px">
              <el-col :span="1.8">
                <el-avatar
                  :src="soncommentItem.userData.avatar"
                  size="large"
                ></el-avatar>
              </el-col>
              <el-col :span="6" 
              style="font-size:11px;color: #0a4399;"
              >
                <span>{{ soncommentItem.userData.userName }}</span>
                <br />
                <span>{{ soncommentItem.lastModified | transformTime }}</span>
              </el-col>
              <el-col 
                style="box-shadow: 0px 0px 6px 0px #ccc inset;
                 height:44px;line-height:44px; font-size:14px;
                  text-indent: 2em;
                  border-radius:10px;"
              :span="18">{{ soncommentItem.content }}</el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-button
            type="text"
            icon="el-icon-s-comment"
            @click="switchisComment(commentItem)"
          >回复</el-button>
        </el-col>
      </el-row>
      <el-row v-if="commentItem.isComment">
        <el-col :span="24">
            <el-input v-model="commentStr" placeholder="请输入评论内容"></el-input>
        </el-col>
        <el-col :span="24" style="text-align: right;margin-top: 20px">
            <el-button type="primary" @click="cancelComment(commentItem,'son')">取消</el-button>
            <el-button type="primary" @click="addComment(commentItem,'son')">回复</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row v-if="isComment">
        <el-col :span="24">
            <el-input v-model="articleCommentStr" placeholder="请输入评论内容"></el-input>
        </el-col>
        <el-col :span="24" style="text-align: right;margin-top: 20px">
            <el-button type="primary" @click="cancelComment(localcomment,'father')">取消</el-button>
            <el-button type="primary" @click="addComment(localcomment,'father')">回复</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import blogService from '@/service/blogService'
export default {
  props:{
    comment:{
      type:Array,
      default(){
        return []
      }
    },
    blogId:{
      type:Number,
      default:0
    }
  },
  watch:{
    comment:{
      handler(){
        this.localcomment = this.comment.slice(0)
      },
      immediate:true
    }
  },
  data() {
    return {
        userData: JSON.parse(sessionStorage.getItem("userData")),
        isComment:true,
        commentStr:'',
        articleCommentStr:'',
        localcomment: [],
    };
  },
  filters: {
    transformTime(time) {
      let blogcreateTime = new Date(time);
      let currentTime = new Date();
      let offsetTime = currentTime - blogcreateTime;
      let offsetST = offsetTime / 1000;
      let offsetMT = offsetST / 60;
      let offsetHT = offsetMT / 60;
      let offsetDT = offsetHT / 24;
      if (offsetDT >= 365) {
        return `发表于${Math.floor(offsetDT / 365)}年之前`;
      } else if (offsetDT >= 30 && offsetDT < 365) {
        return `发表于${Math.floor(offsetDT / 30)}月之前`;
      } else if (offsetDT >= 7 && offsetDT < 30) {
        return `发表于${Math.floor(offsetDT / 7)}周之前`;
      } else if (offsetDT >= 1 && offsetDT < 7) {
        return `发表于${Math.floor(offsetDT)}天之前`;
      } else if (offsetHT >= 1) {
        return `发表于${Math.floor(offsetHT)}小时之前`;
      } else if (offsetMT >= 1) {
        return `发表于${Math.floor(offsetMT)}分钟之前`;
      } else if (offsetST >= 1) {
        return `发表于${Math.floor(offsetST)}秒钟之前`;
      }
    },
  },
  methods:{
    switchisComment(commentItem){
      this.localcomment.forEach( item =>{
        console.log(item);
        if(item !== commentItem){
          item.isComment = false
        }
      })
      commentItem.isComment = !commentItem.isComment;
      console.log(commentItem.isComment);
        if(commentItem.isComment){
          this.isComment = false
        }else{
          this.isComment = true
        }
    },
    cancelComment(target,type){
      switch (type) {
        case 'father':
          this.articleCommentStr = '';
          break;
        case 'son':
          this.commentStr = '';
          target.isComment = false;
          this.isComment = true;
          break;
      }
    },
    addComment(target,type){
      let commentData = {
        blogId: this.blogId,
        comment: {},
        isComment: false,
      }
      switch(type){
        case 'father':
          commentData.userData= {
              userName: this.userData.userName,
              avatar: this.userData.avatar
            },
            commentData.content= this.articleCommentStr,
            commentData.comment =[]
          
          this.articleCommentStr = ""
          break
        case 'son':
          commentData.fatherId = target.commentId;
           commentData.userData= {
              userName: this.userData.userName,
              avatar: this.userData.avatar
            },
            commentData.content=this.commentStr,
            commentData.comment =[]
          
          this.commentStr = ''
          target.isComment = false;
          this.isComment = true;
          break;
      }
      blogService.createComment(commentData).then(rs =>{
        switch (type) {
          case 'father':
            console.log(rs.data.data.commentData);
            target.push(rs.data.data.commentData)
            break;
        
          case 'son':
            target.comment.push(rs.data.data.commentData)
            break;
        }
      })
    }
  }
};
</script>

<style scoped>
.comment-card {
  padding: 20px;
  box-shadow: 0px 5px 5px 0px #cccccc ;
}
</style>