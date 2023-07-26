import App from './App'

// #ifndef VUE3
import Vue, { h } from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'


try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) { }

const app = new Vue({
  ...App
})
app.$mount()
// #endif

import http from "@/utils/http.js"
import utils from "@/utils/index.js"


// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
	
	app.config.globalProperties.requests = http.requests;
	app.config.globalProperties.upload = http.upload;
	app.config.globalProperties.baseUrl = http.baseUrl;
	app.config.globalProperties.getDate = utils.getDate;
  return {
    app
  }
}
// #endif