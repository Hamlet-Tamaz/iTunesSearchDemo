import Vue from 'vue';
import App from './App.vue';
import axios from "axios";
import http from "http";

Vue.prototype.$http = axios;
// Vue.prototype.$http = http;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
