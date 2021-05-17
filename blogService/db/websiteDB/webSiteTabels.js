let mongoose = require('mongoose');
let Schema = mongoose.Schema;
 let rule = new Schema({
     ip: {
         type: String,
         required: true
     },
     visitTime: {
         type: Date,
         required: true
     },
     location: {
         // 经纬度坐标
         type: Array,
         required: true
     },
     province: {
         type: String,
         required: true
     },
     city: {
         type: String,
         required: true
     }
 });

 const  visitorTables = mongoose.model('visitortables',rule);

 module.exports = {
    visitorTables
 }