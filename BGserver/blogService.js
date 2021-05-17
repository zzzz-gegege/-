let axios = require("axios");
let express = require('express');
let siteApp = express();
let gaodeMapKey = "68c4f4f3a01a129f7209deca89b62677";
// siteApp.use(express.static(`${__dirname}/site`));
siteApp.all("*",function(req,res,next){
    console.log('执行')
    let visitorIp = '';
    if(req.ip.substr(0,7) === "::ffff:"){
        visitorIp = req.ip.substr(7);
    }
    axios.get('https://restapi.amap.com/v3/ip',{
        params: {
            key: gaodeMapKey,
            output: 'JSON',
            ip: visitorIp
        }
    }).then(rs =>{
        console.log(rs);
        axios.post('http://127.0.0.1:8888/api/v1/swbsiteData/setVisitorData',{
          ...rs.data,
            ip:visitorIp,
            visitime:new Date()
        })

    })
})

siteApp.listen(80)