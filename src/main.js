import Vue from 'vue';
import App from './App.vue';
import axios from "axios";

Vue.prototype.$http = axios;

new Vue({
  created() {
    if (!localStorage.demoSearchFavorites) {
      localStorage.setItem('demoSearchFavorites', JSON.stringify({}));
    }
  },
  render: h => h(App),
}).$mount('#app')
