<template>
  <div>
    <el-page-header @back="goback" :content="blogData.title"> </el-page-header>
    <el-card class="box-card" style="margin-top: 20px">
      <div class="clearfix" slot="header">
        <el-row>
          <el-col :span="2">
            <el-avatar size="large" :sec="blogData.author.avatar"></el-avatar>
          </el-col>
          <el-col :span="6">
            <span>{{ blogData.author.userName }}</span>
            <br />
            <span>{{ blogData.lastModified | transformTime }}</span>
          </el-col>
          <el-col :span="8">
            <el-button
              type="warning"
              :icon="
                userData.userData.likes.includes(blogId)
                  ? 'el-icon-star-on'
                  : 'el-icon-star-off'
              "
              @click="switchLikes"
              circle=""
            ></el-button>
            <el-button
              type="primary"
              @click="switchattentions"
              :icon="
                userData.userData.attentions.includes(blogData.author.userName)
                  ? 'el-icon-plus'
                  : 'el-icon-check'
              "
              >关注</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-s-custom"
              v-if="!(userData.userName === blogData.author.userName)"
              @click="switchblacklist"
            >
              {{
                userData.userData.blacklist.includes(blogData.author.userName)
                  ? "已拉黑"
                  : "拉黑"
              }}
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-thumb"
              v-if="!(userData.userName === blogData.author.userName)"
              @click="switchTipoff"
              >举报</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div>
        <div v-html="blogData.content"></div>
        <div>
          <el-tag
            type="success"
            v-for="(tag, index) of blogData.tags"
            :key="index"
            style="margin-right: 10px"
            >{{ tag }}</el-tag
          >
        </div>
        <div style="margin-top: 20px">
          <el-row>
            <el-col :span="1"
              ><i class="el-icon-star-on"></i>{{ blogData.likes }}</el-col
            >
            <el-col :span="1"
              ><i class="el-icon-view"></i>{{ blogData.views }}</el-col
            >
            <el-col :span="1"
              ><i class="el-icon-chat-dot-square"></i
              >{{ blogData.comment.length }}</el-col
            >
          </el-row>
        </div>
      </div>
      <el-divider><i class="el-icon-chat-dot-square"></i></el-divider>
      <GlobalComment :comment="blogData.comment"
        :blog-id="blogId"
      ></GlobalComment>
    </el-card>
    <el-dialog
      title="举报文章"
      :visible.sync="isShow"
      width="30%"
    >
    <el-input v-model="reason" placeholder="请输入举报原因"></el-input>
     <span slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取消</el-button>
      <el-button @click="switchTipoff" type="primary">确认</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
import GlobalComment from "@/components/Global-comment"
import blogService from "@/service/blogService";
import TopOffService from "@/service/TopOffService";
import UserDetailService from "@/service/UserDetailService";
export default {
  components: {
    GlobalComment
  },
  data() {
    return {
      blogId: null,
      blogData: {
        title: null,
        tags: null,
        description: null,
        cover: null,
        content: null,
        comment: [],
        author: {},
        lastModified: null,
        views: null,
        likes: null,
        approved: null,
        blogId: null,
      },
      userData: JSON.parse(sessionStorage.getItem("userData")),
      Tipoffmessage:{},
      isShow:false,
      reason:''
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
  created() {
    this.blogId = Number(this.$route.params.id);
    console.log(this.blogId);
    blogService.getBlogByid({ blogId: this.blogId }).then((rs) => {
      this.blogData = rs.data.data.blogData;
    });
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    switchLikes() {
      if (this.userData.userData.likes.includes(this.blogId)) {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        console.log(template.userData);
        template.userData.likes.splice(
          template.userData.likes.indexOf(this.blogId),
          1
        );
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.likes.splice(
          this.userData.userData.likes.indexOf(this.blogId),
          1
        );
        UserDetailService.unlikes(this.blogId).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("取消点赞成功");
          } else {
            this.$message.error("取消点赞成功");
          }
        });
      } else {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        template.userData.likes.push(this.blogId);
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.likes.push(this.blogId);
        UserDetailService.setlikes({ blogId: this.blogId }).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("点赞成功");
          } else {
            this.$message.error("点赞失败");
          }
        });
      }
    },
    switchattentions() {
      if (
        this.userData.userData.attentions.includes(
          this.blogData.author.userName
        )
      ) {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        template.userData.attentions.splice(
          template.userData.attentions.indexOf(this.blogData.author.userName),
          1
        );
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.attentions.splice(
          this.userData.userData.attentions.indexOf(
            this.blogData.author.userName
          ),
          1
        );
        UserDetailService.unattention(this.blogData.author.userName).then(
          (rs) => {
            if (rs.data.status === 200) {
              this.$message.success("取消关注成功");
            } else {
              this.$message.error("取消关注失败");
            }
          }
        );
      } else {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        template.userData.attentions.push(this.blogData.author.userName);
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.attentions.push(this.blogData.author.userName);
        UserDetailService.setattention({
          userName: this.blogData.author.userName,
        }).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("关注成功");
          } else {
            this.$message.error("关注失败");
          }
        });
      }
    },
    switchblacklist() {
      if (
        this.userData.userData.blacklist.includes(this.blogData.author.userName)
      ) {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        template.userData.blacklist.splice(
          template.userData.blacklist.indexOf(this.blogData.author.userName),
          1
        );
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.blacklist.splice(
          this.userData.userData.blacklist.indexOf(
            this.blogData.author.userName
          ),
          1
        );
        UserDetailService.unblacklist(this.blogData.author.userName).then(
          (rs) => {
            if (rs.data.status === 200) {
              this.$message.success("取消拉黑成功");
            } else {
              this.$message.error("取消拉黑失败");
            }
          }
        );
      } else {
        let template = JSON.parse(sessionStorage.getItem("userData"));
        template.userData.blacklist.push(this.blogData.author.userName);
        sessionStorage.setItem("userData", JSON.stringify(template));
        this.userData.userData.blacklist.push(this.blogData.author.userName);
        UserDetailService.setblacklist({
          userName: this.blogData.author.userName,
        }).then((rs) => {
          if (rs.data.status === 200) {
            this.$message.success("拉黑成功");
          } else {
            this.$message.error("拉黑失败");
          }
        });
      }
    },
    switchTipoff(){
      this.isShow = !this.isShow;
      if(!this.isShow){
        const data={
          blogId :this.blogData.blogId ,
          description :this.blogData.description,
          cover :this.blogData.cover,
          title :this.blogData.title,
          reason :this.reason
        }
        if(data.reason){
          console.log(data);
          TopOffService.tipoffservice(data).then(rs =>{
            if(rs.data.status ===200){
              this.$message.success("举报成功")
            }
          })
        }
      }
      this.reason = '';
    }
  },
};
</script>

<style>
</style>