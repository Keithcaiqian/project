<template>
	<view class="news-detail">
		<view class="title">
			{{detail.title}}
		</view>
		<view class="info">
			<text>发表时间：{{detail.add_time|formatDate}}</text>
			<text>浏览：{{detail.click}}</text>
		</view>
		<view class="content">
			<rich-text :nodes="detail.content"></rich-text>
		</view>
	</view>
</template>

<script>
	import {newsDetail} from '../../service/news.js'
	export default {
		data() {
			return {
				id:'',
				detail:{
					add_time:''
				}
			}
		},
		onLoad(options){
			this.id = options.id
			this.getNewsDetail()
		},
		methods: {
			async getNewsDetail(){
				const {data:res} = await newsDetail(this.id)
				this.detail = res.message[0]
			}
		}
	}
</script>

<style lang="scss">
	.news-detail{
		width: 100%;
		font-size: 32rpx;
		.title{
			width: 100%;
			text-align: center;
			font-weight: bold;
			font-size: 40rpx;
		}
		.info{
			box-sizing: border-box;
			padding: 10rpx;
			font-size: 24rpx;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
