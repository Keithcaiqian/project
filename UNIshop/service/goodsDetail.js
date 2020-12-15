import request from './network.js'
function getSwiper(id){
	return request({
		url:'api/getthumimages/'+id
	})
}
function getInfo(id){
	return request({
		url:"api/goods/getinfo/"+id
	})
}
function getDesc(id){
	return request({
		url:"api/goods/getdesc/"+id
	})
}
export {
	getSwiper,
	getInfo,
	getDesc
}