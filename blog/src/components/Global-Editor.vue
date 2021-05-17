<template>
  <el-card class="box-card" v-loading="isPublishing">
    <div class="clearfix" slot="header">
      <span>写文章</span>
      <el-button style="float: right; padding: 3px 0" type="text"
        @click="publishblog"
        >发布</el-button
      >
    </div>
    <el-row>
      <el-col :span="6">
        <el-upload
          class="avatar-uploader"
          :action="`${defaultConfig.baseApiUrl}/uploadImg`"
          name="avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="cover" :src="cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon">封面</i>
        </el-upload>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="24">
            <el-input v-model="title" placeholder="请输入文章标题"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-input
              v-model="description"
              placeholder="请输入文章简介"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tag
              :key="tag"
              v-for="tag in tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ New Tag</el-button
            >
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="editor" ref="editor"></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import uploadImgService from '@/service/uploadImgService'
import Editor from 'wangeditor';
import hljs from 'highlight.js'
import defaultConfig from "@/config/config";
import blogService from '@/service/blogService'
export default {
  name: "GlobalEdit",
  data() {
    return {
      defaultConfig,
      description:'',
      cover: "",
      title: "",
      inputVisible:false,
      tags:[],
      inputValue:'',
      editor:null,
      isPublishing:false
    };
  },
  mounted(){
    //初始化编辑器实例
    this.editor = new Editor(this.$refs.editor);
    //实现代码编辑器里面的代码高亮
    this.editor.highlight = hljs;

    this.editor.config.height = 400;
    this.editor.config.placeholder = '请输入文章内容';
    this.editor.config.zIndex = 1000;

    this.editor.config.uploadImgMaxSize = 2*1024*1024;
    this.editor.config.uploadImgLength = 9
    this.editor.config.customUploadImg = function(resultFiles,insertImgFn){
      let formData = new FormData();
      for(let i =0,len =resultFiles.length; i < len;i++){
        formData.append('avatar',resultFiles[i]);
      }
      uploadImgService.uploadImgFile(formData).then(rs =>{
          for(let i =0,len = rs.data.data.imgList.length; i < len;i++){
          insertImgFn(rs.data.data.imgList[i])
        }
      })
    }
    //把实例变成元素内容
    this.editor.create();
  },
  methods: {
    handleAvatarSuccess(rs) {
      this.cover = rs.data.imgList[0];
    },
    handleClose(tag){
        this.tags.splice(this.tags.indexOf(tag),1);
    },
    handleInputConfirm(){
        if(this.tags.includes(this.inputValue)){
            this.$message.error('标签重复')
            return
        }
        if(this.inputValue){
            this.tags.push(this.inputValue)
            this.inputValue = ''
        }
        this.inputVisible = false
    },
    showInput(){
        this.inputVisible = true
    },
    publishblog(){
      let blogData = {
        title:this.title,
        cover:this.cover,
        description:this.description,
        tags:this.tags,
        content:this.editor.txt.html(),
      }
      if(this.title&&this.cover&&this.description&&this.tags&&blogData.content){
        this.isPublishing = true
        blogService.createBlog(blogData).then(rs =>{
          if(rs.data.status ===200){
            this.$message.success('发布成功')
            this.$emit('publishSuccess')
          }else(
            this.$message.error('发布成功')
          )
        }).finally(() =>{
          this.isPublishing = false
        })
      }else{
        this.$message.error('请完善博客数据')
      }
    }
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>