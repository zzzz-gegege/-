let express = require('express');
let crypto = require('crypto');
let {v4} = require('uuid');
let {UserTabels} = require('../db/usertabelDB/usertabel');
let {userDetailTabels} = require('../db/userdetailDB/userdetaitabel');
const { BlogTables } = require('../db/blogTableDb/blogTable');

let registerApp = express();

function enCryData(data,key,algorithm){
    if(!crypto.getHashes().includes(algorithm)){
        throw new Error('不支持次哈希函数')
    }
    const hmac = crypto.createHmac(algorithm,key);
    hmac.update(data);
    return hmac.digest('hex');
}

registerApp.post('/registerUser',function(req,res){
    let key = v4();
    let password = enCryData(req.body.password,key,'sha256');
    let userName = req.body.userName;
    let avatar = req.body.avatar;
    let token = enCryData(v4(),v4(),'sha256');
    console.log('执行');
    UserTabels.find({
        userName: userName
    }).then((rs) =>{
        if(rs.length){
            res.send({
                status: 500,
                message: "用户名已被注册"
            })
        }else{
            UserTabels.create({
                userName,
                password,
                key,
                token,
                avatar,
                isAdmin:false,
                introduction:'',
                approved:false,
                createTiem:new Date(),
            }).then(() =>{
                res.setHeader('Authorization',token);
                res.send({
                    status:200,
                    message:'注册成功等待审核'
                })
            })

            userDetailTabels.create({
                key,
                comment:[],
                articles:[],
                likes:[],
                attentions:[],
                blacklist:[]
            })
        }
    })
})
registerApp.get('/checkPermission',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(async rs =>{
        if(rs.length){
            let userData = null
            let lieks = 0;
            let views = 0;
            await userDetailTabels.find({
                key: rs[0].key
            },{
                key: false,
                _id: false,
                __v: false
            }).then(userDetails =>{
                userData = userDetails[0]
            })

            await BlogTables.find({
                'author.userName':rs[0].userName
            }).then(list =>{
                list.forEach(listItem =>{
                    lieks += listItem.likes;
                    views += listItem.views
                })
            })
            res.send({
                status:200,
                message:'用户鉴权成功',
                data: {
                    userName: rs[0].userName,
                    avatar: rs[0].avatar,
                    introduction: rs[0].introduction,
                    isAdmin: rs[0].isAdmin,
                    userData,
                    lieks,
                    views
                }
            })
        }else{
            res.send({
                status:500,
                message:'用户鉴权失败',
            })
        }
    })
})

registerApp.get('/AdminInfo',function(req,res){
   
})

registerApp.post('/loginuser',function(req,res){
    UserTabels.find({
        userName: req.body.userName
    }).then(rs =>{
        if(rs.length){
            if(rs[0].password === enCryData(req.body.password,rs[0].key,'sha256')&&rs[0].approved){
                res.setHeader('Authorization',rs[0].token)
                res.send({
                    status:200,
                    message:'登录成功'
                })
            }else if(rs[0].approved === false){
                res.send({
                    status:500,
                    message:'用户正在审核'
                })
            }else{
                res.send({
                    status:500,
                    message:'密码错误'
                })
            }
            
        }else{
            res.send({
                status:404,
                message:'用户名不存在'
            })
        }
    })
})

//更改用户信息

registerApp.post('/updateUserInfo',function(req,res){
    for (const key in req.body) {
        if (!req.body[key]) {
            delete req.body[key]
        }
    }
    UserTabels.updateOne({
        token: req.headers.authorization
    },{
        $set:{
            ...req.body
        }
    }).then(() =>{
        res.send({
            status:200,
            message:'更改成功'
        })
    })
})

//管理
registerApp.get('/unapprovedUser',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(async (rs) =>{
        if(rs.length&&rs[0].isAdmin){
            let {offset,limit} = req.query;
            let totalNum = 0;
            await UserTabels.find({
                approved: false
            }).then(unapprovedUsers =>{
                totalNum = unapprovedUsers.length;
            })
            UserTabels.find({
                approved: false
            },{
                _id:false,
                __v:false
            },{
                skip:Number(offset),
                limit:Number(limit)
            }).then(unapprovedUsers =>{
                res.send({
                    status:200,
                    message:'查询成共',
                    data:{
                        totalNum,
                        userlist: unapprovedUsers
                    }
                })
            })
        }else{
            res.send({
                status:401,
                message:"没有操作权限"
            })
        }
    })
})

registerApp.post('/approveduser',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(async (rs) =>{
        if(rs.length&&rs[0].isAdmin){
            UserTabels.updateOne({
                key: req.body.key
            },{
                $set:{
                    approved: true
                }
            }).then(() =>{
                res.send({
                    status:200,
                    message:'批准用户成功',
                    
                })
            })
        }else{
            res.send({
                status:401,
                message:"没有操作权限"
            })
        }
    })
})
registerApp.post('/deleteuser',function(req,res){
    UserTabels.find({
        token: req.headers.authorization
    }).then(async (rs) =>{
        if(rs.length&&rs[0].isAdmin){
            UserTabels.deleteOne({
                key: req.body.key
            }).then(() =>{
                res.send({
                    status:200,
                    message:'删除用户成功',
                    
                })
            })
        }else{
            res.send({
                status:401,
                message:"没有操作权限"
            })
        }
    })
})

registerApp.get("/getUnapprovedBlog",function(req,res){
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

registerApp.get("/getUnapproveduser",function(req,res){
    let {offset,limit} = req.query;
    let totalNum = 0
    UserTabels.find({
    },{
        __v:false,
        _id:false
    },
    {
        skip:Number(offset),
        limit:Number(limit)
    }).then(rs =>{
        console.log(rs);
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

registerApp.post("/switchAdmin",function(req,res){
    UserTabels.updateOne({
        userName:req.body.userName
    },{
        $set:{
            isAdmin: req.body.isAdmin
        }
    }).then(rs =>{
        if(rs.n === 1){
            res.send({
                status:200,
                message:"更改成功"
            })
        }
        res.send({
            status:500,
            message:"更改失败"
        })
    })
})

registerApp.post("/switchapproved",function(req,res){
    UserTabels.updateOne({
        userName:req.body.userName
    },{
        $set:{
            approved: req.body.approved
        }
    }).then(rs =>{
        if(rs.n === 1){
            res.send({
                status:200,
                message:"更改成功"
            })
        }
        res.send({
            status:500,
            message:"更改失败"
        })
    })
})

registerApp.get("/userRegisterInfo",function(req,res){
    UserTabels.find({},{
        _id:false,
        createTiem: true
    }).then(rs =>{
        res.send({
            status:200,
            data:{
                userInfo: rs
            }
        })
    })
})

registerApp.get("/getblogInfo",function(req,res){
    BlogTables.find({},
        {
            _id: false,
            lastModified: true
        }
    ).then(blogInfo =>{
        res.send({
            status:200,
            data:{
                blogInfo
            }
        })
    })
})
module.exports = {
    registerApp
}