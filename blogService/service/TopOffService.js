let {v4} = require('uuid');
let {UserTabels} = require('../db/usertabelDB/usertabel');
let {userDetailTabels} = require('../db/userdetailDB/userdetaitabel');
let express = require('express');
const { BlogTables } = require('../db/blogTableDb/blogTable');
const {TopOffTables} = require('../db/topOffData/topofftables');

const TopoffApp = express();

TopoffApp.post('/article',function(req,res){
    TopOffTables.create({
        blogId :req.body.blogId ,
        description :req.body.description,
        cover :req.body.cover,
        title :req.body.title,
        reason :req.body.reason
    }).then(rs =>{
        res.send({
            status:200,
            message:"举报成功"
        })
    })
});

TopoffApp.get("/getarticle",async function(req,res){
    let offset = Number(req.query.offset),
        limit = Number(req.query.limit),
        totalNam = 0
       await TopOffTables.find({}).then(rs =>{
            totalNam = Math.ceil(rs.length/limit);
       })

       TopOffTables.find({},
            {
                __v: false
            },{
                skip: offset,
                limit: limit
            }
        ).then(rs =>{
            res.send({
                status:200,
                message:"查询成共",
                data: {
                    rs,
                    totalNam
                }
            })
        })
})

TopoffApp.delete("/deleteTipoff/:id",function(req,res){
    TopOffTables.deleteOne({
        _id:req.params.id
    },function(err){
        if(err){
            res.send({
                status:500,
                message:"删除失败"
            })
        }
        res.send({
            status:200,
            message:"删除成功"
        })
    })
})

TopoffApp.delete("/deleteblog/:id",function(req,res){
    BlogTables.deleteOne({
        blogId: Number(req.params.id)
    },function(err) {
        if(err){
            res.send({
                status:500
            })
        }
    }).then(() =>{
        TopOffTables.deleteMany({
            blogId: Number(req.params.id)
        },function (newerr){
            if(newerr){
                res.send({
                    status:500
                })
            }
        }).then(() =>{
            res.send({
                status:200,
                message:"删除成功"
            })
        })
    })

})

module.exports={
    TopoffApp
}