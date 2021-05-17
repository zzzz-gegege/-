let express = require('express');
let fs = require('fs');
let path = require('path');

let getImgFile = express();

getImgFile.get('/:imgName',function(req,res){
    res.setHeader('Content-Type','image/*');
    fs.createReadStream(path.resolve(__dirname,`../storage/images/${req.params.imgName}`)).pipe(res);
})

module.exports = {
    getImgFile
}
