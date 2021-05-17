let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//用户注册表
let rule = new Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    //个人描述
    introduction: {
        type: String,
    },
    //是否为管理员
    isAdmin: {
        type: Boolean,
    },
    //是否通过校验
    approved: {
        type: Boolean
    },
    //用户创建时间
    createTiem: {
        type:Date
    }
})
 const UserTabels = mongoose.model('usertabels',rule);

 module.exports = {
    UserTabels
 }