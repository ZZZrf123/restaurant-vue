import Vue from 'vue'
import App from './App.vue'
import storage from './model/storage.js'

//配置路由
import VueRouter from 'vue-router'
//请求数据配置
import VueResource from 'vue-resource'
// import axios from 'axios'

//获取url传过来的桌号
//console.log(window.location.hash.split('=')[1]);
var tableId = decodeURIComponent((new RegExp('[?|&]' + 'tableId' + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
//保存桌号
storage.set('tableId',tableId);

import VueSocketIO from 'vue-socket.io'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:9092?tableId='+ tableId,
    vuex: {
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}));
// Vue.prototype.$axios = axios;

//1:引入组件
import Start from './components/Start.vue';
import Cart from './components/Cart.vue';
import Home from './components/Home.vue';
import Hot from './components/Hot.vue';
import Order from './components/Order.vue';
import Pcontent from './components/Pcontent.vue';
import Search from './components/Search.vue';
import EditPeopleInfo from './components/EditPeopleInfo.vue';
import Success from './components/Success.vue'; 
import Scan from './components/Scan.vue'; 

//2：配置路由
const routes = [
  { path: '/start', component: Start },
  { path: '/cart', component: Cart },
  { path: '/home', component: Home },
  { path: '/hot', component: Hot },
  { path: '/order', component: Order },
  { path: '/pcontent', component: Pcontent },
  { path: '/search', component: Search },
  { path: '/editPeopleInfo', component: EditPeopleInfo},
  { path: '/success', component: Success},
  { path: '/scan', component: Scan},
  { path: '/*', redirect: '/start' }
]

//3:实例化vue-router
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

new Vue({
  el: '#app',
  //4：挂载
  router,
  //测试使用
  // sockets: {
  //   connect: function () {
  //       console.log('socket connected')
  //   }
  // },
  render: h => h(App)
})

//5.需要把 <router-view></router-view> 放在根主键里面


