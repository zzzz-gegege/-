import Vue from 'vue';
import App from './app';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from '@/page/login/router'
Vue.use(ElementUI);
Vue.config.productionTip = true;

new Vue({
    render: h =>h(App),
    router:Router
}).$mount('#app');
