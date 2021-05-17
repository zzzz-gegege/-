let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let rule = new Schema({
    blogId: {
        type: Number,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    cover: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    reason: {
        type: String,
        required:true
    },
    lastModified:{
        type:Date
    }
});
const TopOffTables = mongoose.model('topofftabels',rule);

module.exports = {
    TopOffTables
}