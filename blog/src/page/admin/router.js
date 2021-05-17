import Vue from 'vue';
import Vuerouter from "vue-router";

Vue.use(Vuerouter);

let RouterConfig = [
    {
        path:'/',
        redirect:'/dataview'
    },
    {
        path:'/dataview',
        name:'DataView',
        component:() =>import('./views/DBA')
    },
    {
        path:'/review',
        name:'review',
        component:() =>import('./views/Review')
    },
    {
        path:'/tipoff',
        name:'tipoff',
        component:() =>import('./views/Tipoff')
    },
    {
        path:'/permission',
        name:'Permission',
        component:() =>import('./views/Permission')
    },
    {
        path:'/dbmanager',
        name:'dbManager',
        component:() =>import('./views/DBManager')
    },
    {
        path:"/article-detail/:id",
        name:"ArticleDetail",
        component: () => import('@/components/Article-Detail')
    },

];

export default new Vuerouter({
    routes: RouterConfig
})