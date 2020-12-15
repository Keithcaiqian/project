import request from './network.js'
function getCommunityImg(){
	return request({
		url:'api/getimgcategory'
	})
}
function getCommunityRight(id){
	return request({
		url:'api/getimages/'+id
	})
}
export {
	getCommunityImg,
	getCommunityRight
}