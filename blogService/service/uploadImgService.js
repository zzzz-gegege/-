let express = require('express');
let multer = require('multer');
let path = require('path');
let {v4} = require('uuid');
let {apiAddr} = require('../config/config')
const uploadImgApp = express();

let storage = multer.diskStorage({
    destination: function(req,file,cb){
     
        if(file.mimetype.includes('image')){
            cb(null,path.join(__dirname,'../storage/images'))
        }
    },
    filename: function(req,file,cb){
        cb(null,v4()+file.originalname)
    }
});

let uploadParams = multer({
    storage
});

let uploadConfig = uploadParams.fields([
    {
        name: "avatar",
        maxCount:9
    }
]);

uploadImgApp.post('/',uploadConfig,function(req,res){
    let resData = [];
    for(let i = 0 ,len = req.files.avatar.length; i < len;i++){
        resData.push(`${apiAddr.hostAddr}${apiAddr.getImgFileAddr}${req.files.avatar[i].filename}`)
    }
    res.setHeader('Content-Type','aplication/json;charset=utf-8');
    res.send({
        status:200,
        message:'上传成功',
        data: {
            imgList:resData
        }
    })
})

module.exports = {
    uploadImgApp
}