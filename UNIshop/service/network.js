import {baseURL} from './config.js'
export default function(options){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: baseURL + options.url,
			method:options.method || 'get',
			data:options.data || {},
			success:res=>{
				if(res.data.status!==0){
					return uni.showToast({
						title:'获取数据失败'
					})
				}
				resolve(res)
			},
			fail:err=>{
				uni.showToast({
					title:'请求接口失败'
				})
				reject(err)
			}
		})
	})
}