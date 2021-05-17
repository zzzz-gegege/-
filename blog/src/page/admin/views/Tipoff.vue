<template>
  <div>
    <el-table :data="tipoffData" style="width: 100%">
      <el-table-column
        prop="blogId"
        label="博客Id"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="博客标题"
        width="180"
      ></el-table-column>
      <el-table-column prop="cover" label="封面" width="180">
        <template slot-scope="scope" style="width: 180px">
          <el-image :src="scope.row.cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="博客简介"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="reason"
        label="举报原因"
        width="180"
      ></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" @click="goDetail(scope.row)" size="mini"
            >详情</el-button
          >
          <el-button type="primary" @click="appeovedBlog(scope.row)" size="mini"
            >通过</el-button
          >
          <el-button type="danger" @click="rejectBlog(scope.row)" size="mini"
            >忽略</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tipoffservice from "@/service/TopOffService";
export default {
  name: "Tipoff",
  data() {
    return {
      tipoffData: [],
      searchParams: {
        limit: 10,
        offset: 0,
      },
      totalNum: 0,
    };
  },
  created() {
    this.init()
  },
  methods: {
    appeovedBlog(n) {
      tipoffservice.Deleteblog(n).then(rs =>{
        if(rs.data.status ===200){
          this.$message.success("删除成功");
          this.init()
        }
      })
    },
    rejectBlog(n) {
      tipoffservice.DeleteTipoffblog(n).then(rs =>{
        if(rs.data.status === 200){
          this.$message.success("已忽略");
          this.init()
        }
      })
    },
    goDetail(n) {
      this.$router.push(`/article-detail/${n.blogId}`)
      console.log(this.tipoffData);
    },
    init(){
      tipoffservice.getTipoffblog(this.searchParams).then((rs) => {
      if (rs.data.status === 200) {
        this.totalNum = rs.data.data.totalNum;
        this.tipoffData = rs.data.data.rs;
      }
    });
    }
  },
};
</script>

<style>
</style>