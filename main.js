import App from './App'
import './static/font/iconfont.css'
import './static/initialize/reset.css'
import './static/initialize/base.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import drag from '@/config/drag.js'

// #ifndef VUE3
import Vue from 'vue'
import JwChat from 'jwchat';

Vue.use(ElementUI)
Vue.use(JwChat)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
Vue.prototype.send_email = function(id,str,success_str,fail_str){
	uni.request({
		method: 'POST',
		url: `/api/send/${id}`,
		data: str,
		success: (res) => {
			if (res.statusCode == 204) {
				this.$message({
					message: success_str,
					type: 'success'
				});
			} else {
				this.$message.error(fail_str);
				console.log(res.data);
			}
		}
	});
}
// #endif
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif