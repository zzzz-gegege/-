import Vue from 'vue';
import App from './app';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'highlight.js/styles/darcula.css'
import Router from '@/page/user/router'
console.log("hello");
Vue.use(ElementUI);
Vue.config.productionTip = true;

new Vue({
    render: h =>h(App),
    router:Router
}).$mount('#app');
