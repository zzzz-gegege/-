<template>
  <div>
    <GlobalArticle
      v-for="(item,index) of bloglist "
      :key="index"
      :article-data="item"
    ></GlobalArticle>
    <el-pagination 
      layout="prev,pager,next"
      :page-size="params.limit" 
      :total="totalNum"
      @current-change="changepage"
    > </el-pagination>
  </div>
</template>

<script>
import GlobalArticle from "@/components/GlobalArticle";
import blogService from '@/service/blogService'
export default {
  components: {
    GlobalArticle,
  },
  data() {
    return {
        bloglist:[],
        params:{
          limit:1,
          offset: 0
        },
        totalNum: 0
    };
  },
  created(){
    this.getBlogData()
  },
  methods:{
   getBlogData(){
     blogService.getMyBlog(this.params).then(rs =>{
        this.bloglist = rs.data.data.rs
        this.totalNum = rs.data.data.totalNum
      })
   },
    changepage(page){
      this.params.offset = (page-1) *this.params.limit;
      this.getBlogData()
    }
  }
};
</script>

<style>
</style>