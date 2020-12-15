<template>
	<view class="home">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="item in carousels" :key="item.id">
				<image :src="item.img" mode=""></image>
			</swiper-item>
		</swiper>
		<view class="nav">
			<view class="nav-item" v-for="(item,index) in navList" :key='index' @click="toPage(item.page)">
				<image :src="item.src" mode=""></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="hot-goods">
			<view class="title"><text space="emsp">推 荐 商 品</text></view>
			<goods-list @toGoodsDetail='toGoodsDetail' :goods='hotGoods'/>
		</view>
	</view>
</template>

<script>
	import { getSwiper,getHotGoods } from '../../service/index.js'
	import goodsList from '../../components/goodsList/goodsList.vue'
	export default {
		data() {
			return {
				carousels:[],
				navList:[{
					name:'大超市',
					src:'../../static/t1.png',
					page:'/pages/goods/goods'
				},{
					name:'联系我们',
					src:'../../static/t2.png',
					page:'/pages/contact/contact'
				},{
					name:'社区图片',
					src:'../../static/t3.png',
					page:'/pages/community/community'
				},{
					name:'学习视频',
					src:'../../static/t4.png',
					page:'/pages/video/video'
				}],
				hotGoods:[]
			}
		},
		onLoad() {
			this.getSwiperData()
			this.getHotGoods()
		},
		methods: {
			async getSwiperData(){
				const {data:res} = await getSwiper()
				this.carousels = res.message
			},
			async getHotGoods(){
				const {data:res} = await getHotGoods(1)
				this.hotGoods = res.message
				console.log(res)
			},
			toPage(path){
				uni.navigateTo({
					url:path
				})
			},
			toGoodsDetail(id){
				uni.navigateTo({
					url:'/pages/goods-detail/goods-detail?id='+id
				})
			}
		},
		components:{
			goodsList
		}
	}
</script>

<style lang="scss">
	.home{
		swiper{
			width: 750rpx;
			height: 380rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.nav{
			display: flex;
			width: 100%;
			text-align: center;
			.nav-item{
				flex: 1;
				image{
					margin: 20rpx auto;
					display: block;
					width: 90rpx;
					height: 90rpx;
				}
			}
		}
		.hot-goods{
			width: 100%;
			background-color: #eee;
			overflow: hidden;
			.title{
				width: 100%;
				height: 80rpx;
				background-color: #fff;
				line-height: 80rpx;
				margin:10rpx 0;
				color: $shop-color;
				text-align: center;
			}
			
		}
	}
</style>
