<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章管理" name="article">
        <el-table :data="blogList" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="文章标题" width="180">
          </el-table-column>
          <el-table-column prop="blogId" label="博客ID"></el-table-column>
           <el-table-column
              prop="author.userName"
              label="作者"
          >
          </el-table-column>
          <el-table-column label="封面">
            <template slot-scope="scope">
              <el-image fit="fill" :src="scope.row.cover" style="width: 100px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="发布时间">
            <template slot-scope="scope">
              {{ scope.row.lastModified | transformTime }}
            </template>
          </el-table-column>
          <el-table-column prop="discription" label="文章简介" width="180">
          </el-table-column>
          <el-table-column label="标签">
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-for="(item, index) of scope.row.tags"
                :key="index"
              >
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="danger" @click="rejectBlog(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-pagination
            layout="prev,pager,next"
            :total="usertotalNum"
            :page-size="serchUserparams.limit"
            @current-change="handleUsercrrentchange"
          >
          </el-pagination>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="用户管理" name="user">
        <el-table :data="userList" style="width: 100%">
          <el-table-column
            prop="userName"
            label="用户名"
            width="180"
          ></el-table-column>
          <el-table-column prop="avatar" label="头像">
            <template slot-scope="scope">
              <el-image
                fit="fill"
                :src="scope.row.avatar"
                style="width: 100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="introduction"
            label="用户简介"
          ></el-table-column>
          <el-table-column label="是否通过审核">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.approved" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column
              label="是否为管理员"
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isAdmin" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作"
            width="180"
          >
           <template slot-scope="scope">
              <el-button type="danger" @click="rejectUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-pagination
        layout="prev,pager,next"
        :total= blogtotalNum
        :page-size="serchUserparams.limit"
        @current-change="handleUsercrrentchange"
      >
      </el-pagination>
    </div>
   
  </div>
</template>

<script>
import identifyService from "@/service/identifyService";
import blogService from "@/service/blogService";
export default {
  data() {
    return {
      serchUserparams: {
        limit: 10,
        offset: 0,
      },
      serchBlogparams: {
        limit: 10,
        offset: 0,
      },
      usertotalNum: 0,
      blogtotalNum: 0,
      userList: [],
      activeName: "article",
      blogList: [],
      isshow: "article",
    };
  },
  watch: {
    activeName(newvalue) {
      console.log(newvalue);
      this.isshow = newvalue;
    },
  },
  created() {
    this.getUserList();
    this.getBlogList();
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
  methods: {
    getUserList() {
      identifyService.getUnapproveduser(this.serchUserparams).then((rs) => {
        this.userList = rs.data.data.rs;
        this.usertotalNum = rs.data.data.totalNum;
      });
    },
    rejectUser(user) {
      identifyService.deleteuser({ key: user.key }).then((rs) => {
        if (rs.data.status === 200) {
          this.$message.success("删除成功");
          this.getUserList();
        }
      });
    },
    handleUsercrrentchange(pager) {
      this.serchUserparams.offset = (pager - 1) * this.serchUserparams.limit;
      this.getUserList();
    },
    getBlogList() {
      identifyService.getUnapprovedBlog(this.serchBlogparams).then((rs) => {
        console.log(rs.data.data.rs);
        this.blogList = rs.data.data.rs;
        this.blogtotalNum = rs.data.data.totalNum;
      });
    },
    rejectBlog(article) {
      blogService.deleteblog({ blogId: article.blogId }).then((rs) => {
        if (rs.data.status === 200) {
          this.$message.success("删除成功");
          this.getBlogList();
        }
      });
    },
    handleBlogcrrentchange(pager) {
      this.serchBlogparams.offset = (pager - 1) * this.serchBlogparams.limit;
      this.getBlogList();
    },
  },
};
</script>

<style>
</style>