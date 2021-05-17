let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');



mongoose.connect('mongodb://localhost:27017/',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('数据库连接成功');
}).catch(() =>{
    console.log('数据库链接失败');
});

let app = express();

//启用通用中间件

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.all('*',function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTION');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Expose-Headers','Authorization');
    next()
})

let {getImgFile} = require('./service/getImgservice');
let {uploadImgApp} = require('./service/uploadImgService');
let {registerApp} = require('./service/identifyService');
let {blogApp} = require('./service/blogService');
let {TopoffApp} = require('./service/TopOffService');
let {webSiteApp} = require('./service/webSiteService');

let {apiAddr} = require('./config/config')
app.use(apiAddr.uploadImgApiaddr,uploadImgApp)
app.use(apiAddr.getImgFileAddr,getImgFile);
app.use(apiAddr.registerApiAddr,registerApp);
app.use(apiAddr.blogApiAddr,blogApp);
app.use(apiAddr.TopOffAddr,TopoffApp);
app.use(apiAddr.webSiteAddr,webSiteApp);
app.listen(8888)

const WebSocket = require('ws');
const ws = new WebSocket.Server({port:12778});
let userList = [];
ws.on('connection',function connection(user){
    userList.push(user);
    user.on('message',function incoming(message){
        
        for(let i =0; i < userList.length; i++){

            if(userList[i] !==user){
                userList[i].send(message)
            }
        }
    })
})
