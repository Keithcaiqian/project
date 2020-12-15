import request from './network.js'
function getNews(){
	return request({
		url:"api/getnewslist"
	})
}
function newsDetail(id){
	return request({
		url:'api/getnew/'+id
	})
}
export {
	getNews,
	newsDetail
}