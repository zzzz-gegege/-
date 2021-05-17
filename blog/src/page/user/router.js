import Vue from 'vue';
import Vuerouter from "vue-router";

Vue.use(Vuerouter);

let RouterConfig = [
    {
        path:'/',
        redirect:'/home/article'
    },{
        path:'/home/:id',
        name:'home',
        component: () => import('./views/Home')

    },{
        path:'/chathome',
        name:"ChatHome",
        component: () => import('./views/Chathome')
    },{
        path:'/bolglist',
        name:"BlogList",
        component: () => import('./views/Bloglist')
    },{
        path:"/article-edit",
        name:"ArticleEdit",
        component: () => import('./views/Article-edit')
    },{
        path:"/article-detail/:id",
        name:"ArticleDetail",
        component: () => import('@/components/Article-Detail')
    },{
        path:"/Search",
        name:'Search',
        component: () => import('./views/Search')
    }
];

export default new Vuerouter({
    routes: RouterConfig
})