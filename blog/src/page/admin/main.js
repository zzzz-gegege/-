import Vue from 'vue';
import App from './app';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/page/admin/router'
import * as echarts from 'echarts';

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    render: h =>h(App),
    router
}).$mount('#app');
