let {v4} = require('uuid');
let {UserTabels} = require('../db/usertabelDB/usertabel');
let {userDetailTabels} = require('../db/userdetailDB/userdetaitabel');
let express = require('express');
const { BlogTables } = require('../db/blogTableDb/blogTable');
const {TopOffTables} = require('../db/topOffData/topofftables');

let blogApp = express();

blogApp.post('/createBlogItem',async function(req,res){
    let newblogData = {
        title:req.body.title,
        tags:req.body.tags,
        description: req.body.description,
        cover: req.body.cover,
        content:req.body.content,
        comment:[],
        author:{},
        lastModified:new Date(),
        views:0,
        likes:0,
        approved:false,
        blogId:0
    }
    await UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        if(rs[0].isAdmin){
            newblogData.approved = true;
        }
    })
    //生成新的博客id
    await BlogTables.find({

    },{
        blogId: true
    },{
        sort:{
            blogId: -1
        }
    }).then(rs =>{
        if(rs.length){
            newblogData.blogId = rs[0].blogId + 1
        }else{
            newblogData.blogId = 1
        }
    })

    //设置博客作者信息
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        newblogData.author = {
            userName: rs[0].userName,
            avatar: rs[0].avatar
        }

      
        //往用户详情表添加博客id
        userDetailTabels.updateOne({
            key: rs[0].key
        },{
            $push:{
                articles: newblogData.blogId
            }
        }).then(n =>{
            console.log(n);
        })

        //网博客数据表创建新的文章
        BlogTables.create(newblogData).then(args =>{
            res.send({
                status: 200,
                message: '博客创建成功'
            })
        }).catch(() =>{
            res.send({
                status: 500,
                message: '发布失败'
            })
        })
    })
});

blogApp.get('/getpulickBlog',async function(req,res){
    let params = {
        approved: true,
    };
    
    let {limit, offset,serchkey} = req.query;
    if(serchkey){
        params.title = serchkey
    }

    //获取黑名单
    let blacklist = []
   if(req.headers.authorization){
    await UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        await userDetailTabels.find({
            key: rs[0].key
        }).then(list =>{
            blacklist = list[0].blacklist
        })
    })
   }

   if(blacklist.length){
       //当用户有黑名单时
        params['author.userName']={
            $nin: blacklist
        } 
   }
   let totalNum = 0
   await BlogTables.find({
       ...params
   }).then(blacklist =>{
        totalNum = blacklist.length;
   })
   
   BlogTables.find({
       ...params
   },{
       _id: false,
       __v: false,
       content: false
   },{
       skip: Number(offset),
       limit: Number(limit),
       sort: {
        lastModified: -1
       }
   }).then(rs =>{
        res.send({
            status: 200,
            message: '查询成功',
            data: {
                rs,
                totalNum
            }
        })
   })
   
    
});

blogApp.get('/getBlogDetailByid', async function(req,res){
    let params = {
        blogId: req.query.blogId
    }

    await BlogTables.updateOne(
        params,
        {
            $inc: {
                views: 1
            }
        }
    ).then(() =>{
        console.log('博客阅览数加一');
    })

    BlogTables.find(
        params,
        {
            _id:false,
            __v: false
        }
    ).then(rs =>{
        res.send({
            status: 200,
            message: '查询成功',
            data: {
                blogData:rs[0]
            }
        })
    })
})

//给博客点赞
blogApp.post('/likes',function(req,res){
    let params = {
        blogId: req.body.blogId
    }
    BlogTables.updateOne(
        params,
        {
            $inc: {
                likes: 1
            }
        }
    ).then(() =>{
        UserTabels.find({
            token: req.headers.authorization
        }).then(rs =>{
            userDetailTabels.updateOne({
                key: rs[0].key
            },{
                $push:{
                    likes: req.body.blogId
                }
            }).then(() =>{
                console.log('点赞成功');
                res.send({
                    status:200,
                    message:'点赞成功'
                })
            })
        }).catch(() =>{
                console.log('点赞失败');
                res.send({
                    status:200,
                    message:'点赞失败'
                })
            })
    })
})

//给博客取消点赞
blogApp.delete('/likes/:id',function(req,res){
    let params = {
        blogId: Number(req.params.id)
    }
    BlogTables.updateOne(
        params,
        {
            $inc: {
                likes: -1
            }
        }
    ).then(() =>{
        UserTabels.find({
            token: req.headers.authorization
        }).then(rs =>{
            userDetailTabels.updateOne({
                key: rs[0].key
            },{
                $pull:{
                    likes: Number(req.params.id)
                }
            }).then(() =>{
                console.log('取消点赞成功');
                res.send({
                    status:200,
                    message:'取消点赞成功'
                })
            })
        }).catch(() =>{
                res.send({
                    status:200,
                    message:'取消点赞失败'
                })
            })
    })
})

//拉黑
blogApp.post('/blacklist',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        userDetailTabels.updateOne({
            key: rs[0].key
        },{
            $push:{
                blacklist: req.body.userName
            }
        }).then(() =>{
            console.log('拉黑成功');
            res.send({
                status:200,
                message:'拉黑成功'
            })
        })
    }).catch(() =>{
            res.send({
                status:200,
                message:'拉黑失败'
            })
    })
})
//取消拉黑
blogApp.delete('/blacklist/:userName',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        userDetailTabels.updateOne({
            key: rs[0].key
        },{
            $pull:{
                blacklist: req.params.userName
            }
        }).then(() =>{
            console.log('取消拉黑成功');
            res.send({
                status:200,
                message:'取消拉黑成功'
            })
        })
    }).catch(() =>{
            res.send({
                status:200,
                message:'取消拉黑失败'
            })
    })
})
//关注
blogApp.post('/attention',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        userDetailTabels.updateOne({
            key: rs[0].key
        },{
            $push:{
                attentions: req.body.userName
            }
        }).then(() =>{
            console.log('关注成功');
            res.send({
                status:200,
                message:'关注成功'
            })
        })
    }).catch(() =>{
            res.send({
                status:200,
                message:'关注失败'
            })
    })
})
//取消关注
blogApp.delete('/attention/:userName',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        userDetailTabels.updateOne({
            key: rs[0].key
        },{
            $pull:{
                attentions: req.params.userName
            }
        }).then(() =>{
            console.log('取消关注成功');
            res.send({
                status:200,
                message:'取消关注成功'
            })
        })
    }).catch(() =>{
            res.send({
                status:200,
                message:'取消关注失败'
            })
    })
})

//评论
blogApp.post('/comment/create',function(req,res){
    let reqData = req.body;
    let commentData = {
        ...reqData,
        lastModified: new Date(),
        commentId: v4()
    }
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        let key = rs[0].key;
        userDetailTabels.updateOne({
            key: key,
            comment: {
                $elemMatch: {
                    blogId: reqData.blogId
                }
            }
        },{
            $push: {
                'comment.$.commentData': {
                    ...commentData
                }
            }
        }).then(async (rs) =>{
            if(rs.n<1){
                let blogId = {};
                await BlogTables.find({
                    blogId: reqData.blogId
                },{
                    title: true,
                    author: true,
                    cover: true,
                    description: true,
                    lastModified: true
                }).then(rs =>{
                    blogData= rs[0]
                });
                userDetailTabels.updateOne({
                    key
                },{
                    $push: {
                        'comment': {
                            blogId: reqData.blogId,
                            blogData,
                            commentData:[
                                commentData
                            ]
                        }
                    }
                }).then(rs =>{
                    console.log('创建新博客id的评论条目');
                    res.send({
                        status: 200,
                        message: '评论成功'
                    })
                })
            }
        })
    })

    if(reqData.fatherId){
        BlogTables.updateOne({
            blogId: reqData.blogId,
            comment: {
                $elemMatch: {
                    commentId: reqData.fatherId
                }
            }
        },{
            $push: {
                'comment.$.comment': commentData
            }
        }).then(rs =>{
            console.log('添加二级评论');
            res.send({
                status:200,
                message: '品论成功',
                data: {
                    commentData
                }
            })
        
        })
    }else{
        BlogTables.updateOne({
            blogId: reqData.blogId,
        },{
            $push: {
                'comment': commentData
            }
        }).then(rs =>{
            console.log('添加一级评论');
            res.send({
                status:200,
                message: '品论成功',
                data: {
                    commentData
                }
            })
        
        })
    }
})

//获取我的文章
blogApp.get('/getmyblog',function(req,res){
    let params ={};
    let {offset,limit} = req.query
    UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        let totalNum = 0
        console.log(rs);
        await BlogTables.find({
            'author.userName': rs[0].userName 
        }).then(rs =>{
            totalNum = rs.length
        })
        BlogTables.find({
            'author.userName': rs[0].userName,
            approved:true
        },{
            _id: false,
            __v:false,
            content:false,
        },{
            sort:{
                lastModified:-1
            },
            limit: Number(limit),
            skip:Number(offset)
        }).then(rs =>{
            res.send({
                status:200,
                message:'查讯成功',
                data:{
                    rs,
                    totalNum
                }
            })
        })
    })
})

//获取我喜欢的文章
blogApp.get('/mylikes' ,async function(req,res){
    let params = {};
    let {offset,limit} = req.query;
    let likes = [];
    let totalNum = 0
    await UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        await userDetailTabels.find({
            key: rs[0].key
        }).then(list =>{
            likes = list[0].likes;
            totalNum = likes.length
        })
    })
    BlogTables.find(
        {
           blogId:{
               $in: likes
           },
           ...params
        },{
            _id: false,
            __v:false,
            content:false,
        },{
            sort:{
                lastModified:-1,
            },
            limit:Number(limit),
            skip:Number(offset)
        }).then(rs =>{
            res.send({
                status:200,
                message:'查询成功',
                data:{
                    rs,
                    totalNum
                }
            })
        })

})

//获取我的评论
blogApp.get('/getcomment',function(req,res){
    let {offset,limit} = req.query;
    let totalNum = 0
    UserTabels.find({
        token: req.headers.authorization
    }).then(rs =>{
        userDetailTabels.find({
            key: rs[0].key
        }).then(list =>{
            totalNum = list[0].comment.length;
            res.send({
                status:200,
                message:'查询成功',
                data:{
                    totalNum,
                    commentlist: list[0].comment.slice(Number(offset),Number(offset)+Number(limit))
                }
            })
        })
    }).catch(() =>{
        res.send({
            status:500,
            message: '查询失败'
        })
    })
})

//获取我的关注
blogApp.get('/getattentions',function(req,res){
    let {offset,limit} = req.query;
    let totalNum = Number(req.query.totalNam);
    UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        let attentions = []
       await userDetailTabels.find({
            key: rs[0].key
        }).then(attentionlist =>{
            attentions = attentionlist[0].attentions.slice(Number(offset),Number(offset)+Number(limit));
            totalNum += Math.ceil(attentionlist[0].attentions.length/Number(limit))
        })

        UserTabels.find({
            userName:{
                $in: attentions
            }
        },{
            userName: true,
            avatar: true,
            introduction:true
        }).then(rs =>{
            res.send({
                status: 200,
                message: '查询成功',
                data: {
                    rs,
                    totalNum
                }
            })
        })
    })
})

//获取我的黑名单
blogApp.get('/getblaclist',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        let totalNum = 0;
        let blacklist = []
      await userDetailTabels.find({
            key: rs[0].key
        }).then(list =>{
            blacklist = list[0].blacklist.slice(Number(offset),Number(offset)+Number(limit));
            totalNum = Math.ceil(attentionlist[0].attentions.length/Number(limit))
        })

        UserTabels.find({
            userName:{
                $in: blacklist
            }
        },{
            userName:true,
            avatar:true,
            introduction:true
        }).then(rs =>{
            res.send({
                status:200,
                message: '查询成功',
                data: {
                    rs,
                    totalNum
                }
            })
        })
    })
})

//搜索博客
blogApp.get('/searchblog',function(req,res){
    let {searchKey} = req.query;
    BlogTables.find({
        $or:[
            {
                title:searchKey
            },
            {
              tags:{
                  $all:[searchKey]
              }  
            }
        ]
    },{
        title:true,
        author:true,
        tags:true,
        blogId:true,
        cover:true
    }).then(rs =>{
        console.log(rs);
        res.send({
            status:200,
            message:'查询成功',
            data:{
                rs
            }
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:'查询失败'
        })
    })
})

//获取未审核的博客
blogApp.get('/unapprovedblog',function(req,res){
    let {offset,limit} = req.query;
    let totalNum = 0
    BlogTables.find({
        approved: false
    },{
        __v:false,
        _id:false
    },{
        sort:{
            lastModified:1
        },
        skip:Number(offset),
        limit:Number(limit)
    }).then(rs =>{
        totalNum = Math.ceil(rs.length/Number(limit));
        res.send({
            status:200,
            message:'查询成功',
            data:{
                rs,
                totalNum
            }
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:"查询失败"
        })
    })
})

//博客通过
blogApp.post('/approvedblog',function(req,res){
    console.log(req.body);
    BlogTables.updateOne({
        blogId: req.body.blogId
    },{
        $set:{
            approved: true
        }
    }).then(rs =>{
        res.send({
            status:200,
            message:'审核以通过',
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:"失败"
        })
    })
})

//删除未通过的博客
blogApp.post('/deleteblog',function(req,res){
    BlogTables.deleteOne({
        blogId: req.body.blogId
    }).then(rs =>{
        res.send({
            status:200,
            message:'成功删除未审核的博客',
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:"失败"
        })
    })
})


blogApp.get("/getUnapprovedBlog",function(req,res){
    let {offset,limit} = req.query;
    let totalNum = 0
    BlogTables.find({
    },{
        __v:false,
        _id:false
    },{
        sort:{
            lastModified:1
        },
        skip:Number(offset),
        limit:Number(limit)
    }).then(rs =>{
        totalNum = Math.ceil(rs.length/Number(limit));
        res.send({
            status:200,
            message:'查询成功',
            data:{
                rs,
                totalNum
            }
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:"查询失败"
        })
    })
})

blogApp.get("/getUnapproveduser",function(req,res){
    let {offset,limit} = req.query;
    let totalNum = 0
    UserTabels.find({
    },{
        __v:false,
        _id:false
    },{
        sort:-1,
        skip:Number(offset),
        limit:Number(limit)
    }).then(rs =>{
        totalNum = Math.ceil(rs.length/Number(limit));
        res.send({
            status:200,
            message:'查询成功',
            data:{
                rs,
                totalNum
            }
        })
    }).catch(() =>{
        res.send({
            status:500,
            message:"查询失败"
        })
    })
})
module.exports = {
    blogApp
}