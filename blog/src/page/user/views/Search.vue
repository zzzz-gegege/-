<template>
  <div style="width: 100vw;">
    <h1 v-if="!blogList.length">抱歉，搜索的主题不存在！！</h1>
    <div style="width: 1200px; margin: 100px auto">
      <el-row
        v-for="(item, index) of sliceblogList"
        :key="index"
        style="
          height: 180px;
          border: 1px solid #cccccc;
          padding: 12px;
          box-sizing: content-box;
        "
        class="blog-item"
      >
        <el-col :span="2">
          <el-avatar :src="item.author.avatar"></el-avatar>
          <span>{{ item.author.userName }}</span>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-image :src="item.cover" style="height: 178px"></el-image>
        </el-col>
        <el-col :span="6" :offset="2">
          <p style="font-weight: 600">{{ item.title }}</p>
          <p style="color: rgb(219, 94, 85)">{{ item.tags.join() }}</p>
          <p @click="goDetail(item.blogId)">博客详情>></p>
        </el-col>
      </el-row>
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totalNum"
        @current-change="switchpage"
        ref="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import blogService from "@/service/blogService";
export default {
  name: "Search",
  data() {
    return {
      searchKey: sessionStorage.getItem("SearchKey"),
      blogList: [],
      sliceblogList: [],
      totalNum: 0,
    };
  },
  created() {
    blogService.searchBlog({ searchKey: this.searchKey }).then((rs) => {
      this.blogList = rs.data.data.rs;
      if(!this.blogList.length){
        this.$refs.pagination.$el.style.display = "none";
      }
      this.totalNum = Math.ceil(this.blogList.length / 5);
      this.sliceblogList = this.blogList.slice(0, 5);
        sessionStorage.removeItem("SearchKey");
    });
  },
  methods: {
    switchpage(pager) {
      console.log(pager);
      this.sliceblogList = this.blogList.slice(pager * 5 - 5, pager * 5);
    },
    goDetail(blogId) {
      this.$router.push(`/article-detail/${blogId}`);
    },
  },
};
</script>

<style>
body{
  margin: 0px;
}
.blog-item:hover {
  box-shadow: 0px 0px 6px 0px #ccc;
}
</style>