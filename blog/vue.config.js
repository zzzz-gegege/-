module.exports = {
    publicPath:'./',
    outputDir:'site',
    pages:{
        admin:{
            entry:'src/page/admin/main.js',
            template:'public/admin.html',
            filename:'admin.html',
            title:'用管理界面'            
        },
        user:{
            entry:'src/page/user/main.js',
            template:'public/index.html',
            filename:'index.html',
            title:'用户界面'
        },
        login:{
            entry:'src/page/login/main.js',
            template:'public/login.html',
            filename:'login.html',
            title:'登录界面'
        }
    },
    
    configureWebpack: {
        devtool:'source-map'
    }
}