<template>
  <div>
    <p @click="goback">
      <i class="el-icon-back"></i>返回
    </p>
    <GlobalEditor @publishSuccess="goback"></GlobalEditor>
  </div>
</template>

<script>
import GlobalEditor from '@/components/Global-Editor';
export default {
  name: "ArticleEdit",
  components:{
    GlobalEditor
  },
  methods:{
    goback(){
      this.$router.go(-1)
    }
  },
  created(){
   //
  }
};
</script>

<style>
</style>