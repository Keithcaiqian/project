<template>
	<view class="news">
		<view class="news-item" @click="goNewsDetail(item.id)" v-for="item in message" :key='item.id'>
			<image :src="item.img_url"></image>
			<view class="right">
				<view class="title">
					{{item.title}}
				</view>
				<view class="bottom">
					<text>发表时间:{{item.add_time | formatDate}}</text>
					<text>浏览：{{item.click}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getNews} from '../../service/news.js'
	export default {
		data() {
			return {
				message:[]
			}
		},
		onLoad(){
				this.getNewsList()
		},
		methods: {
			async getNewsList(){
				const {data:res} = await getNews()
				this.message = res.message
				console.log(res)
			},
			goNewsDetail(id){
				uni.navigateTo({
					url:'/pages/news-detail/news-detail?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.news{
		width: 100%;
		.news-item{
			font-size: 30rpx;
			width: 100%;
			display: flex;
			height: 180rpx;
			margin: 10rpx 0;
			border-bottom: 1px solid $shop-color;
			image{
				width: 200rpx;
				height: 130rpx;
				margin: 10rpx 15rpx;
			}
			.right{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				margin: 10rpx 15rpx;
				.bottom{
					font-size: 26rpx;
					text:nth-child(2){
						margin-left: 20rpx;
					}
				}
			}
		}
		
	}
</style>
