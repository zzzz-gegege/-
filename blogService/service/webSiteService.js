let express = require('express');
let {visitorTables} = require('../db/websiteDB/webSiteTabels');
let webSiteApp = express();

webSiteApp.post('/setVisitorData',function(req,res){
    let reqData = req.body;
    console.log(reqData)
    res.send()
})

module.exports = {
    webSiteApp
}
