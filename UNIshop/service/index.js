import request from './network.js'
function getSwiper(){
	return request({
		url:'api/getlunbo'
	})
}
function getHotGoods(num){
	return request({
		url:`api/getgoods?pageindex=${num}`
	})
}
export {
	getSwiper,
	getHotGoods
}