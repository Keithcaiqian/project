import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.filter('formatDate',(date)=>{
	var date = date.split('T')[0]
	return date
})
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
