let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//用户详情表
let rule = new Schema({
    key:{
        type: String,
        required: true
    },
    //博客列表
    articles: {
        type: Array,
        required: true
    },
    //评论
    comment: {
        type: Array,
        required: true,
    },
    //喜欢
    likes: {
        type: Array,
        required: true
    },
    //关注
    attentions: {
        type: Array,
    },
    //黑名单
    blacklist: {
        type: Array
    },
});

const userDetailTabels = mongoose.model('userdetailtabels',rule);

module.exports = {
    userDetailTabels
}
