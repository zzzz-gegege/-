let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let rule = new Schema({
    //标题
    title: {
        type: String,
        required: true
    },
    //文章标签
    tags: {
        type: Array,
        required:true
    },
    //简介
    description: {
        type:String,
        required: true
    },
    //封面
    cover: {
        type:String,
        required: true
    },
    content: {
        type:String,
        required: true
    },
    //博客评论
    comment: {
        type:Array,
        required: true
    },
    //作者信息
    author: {
        type: Object,
        required: true
    },
    lastModified: {
        type: Date,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    //博客点赞数
    likes: {
        type: Number,
        required: true
    },
    //审核
    approved: {
        type: Boolean,
        required: true
    },
    blogId: {
        type: Number,
        required: true
    }
});

const BlogTables = mongoose.model('blogtables',rule);

module.exports = {
    BlogTables
}