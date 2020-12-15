<template>
	<view class="goods">
		<goodsList :goods='goods'/>
		<view class="bottom" v-if="isBottom">
			-----已经到底啦-----
		</view>
	</view>
</template>

<script>
	import goodsList from '../../components/goodsList/goodsList.vue'
	import {getHotGoods} from '../../service/index.js'
	export default {
		data() {
			return {
				curPage:1,
				goods:[],
				isBottom:false
			}
		},
		onLoad(){
			this.getGoodsData()
		},
		onReachBottom(){
			if(this.goods.length<this.curPage*10){
				return;
			}
			this.curPage++;
			this.getGoodsData()
			this.isBottom = true
		},
		onPullDownRefresh(){
			this.curPage = 1;
			this.goods = [];
			this.isBottom = false;
			setTimeout(()=>{
				this.getGoodsData(function(){
					uni.stopPullDownRefresh()
				})
			},1000)
		},
		methods: {
			async getGoodsData(callback){
				const {data:res} = await getHotGoods(this.curPage)
				this.goods = [...this.goods,...res.message] 
				callback&&callback()
			}
		},
		components:{
			goodsList
		}
	}
</script>

<style lang="scss">
	.goods{
		background-color: #eee;
		.bottom{
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			font-size: 30rpx;
		}
	}
</style>
