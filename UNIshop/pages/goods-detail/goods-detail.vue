<template>
	<view class="goods-detail">
		<swiper :indicator-dots="true" :duration="1000">
			<swiper-item v-for="(item,index) in swiper" :key='index'>
				<image :src="item.src" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		<view class="price">
			<text>￥{{info.sell_price}}</text>
			<text>￥{{info.market_price}}</text>
		</view>
		<view class="title">
			{{info.title}}
		</view>
		<view class="category">
			<view>货号:{{info.goods_no}}</view>
			<view>库存:{{info.stock_quantity}}</view>
		</view>
		<view class="detail">
			<view class="detail-title">
				详情介绍
			</view>
			<view class="content">
				<rich-text :nodes="desc"></rich-text>
			</view>
		</view>
		<view class="goods-tabBar">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import {
		getSwiper,
		getInfo,
		getDesc
	} from '../../service/goodsDetail.js'
	export default {
		data() {
			return {
				id: '',
				swiper: [],
				info: {},
				desc: '',
				options: [{
					icon: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/uni-ui/goodsnav/kefu.png',
					text: '客服'
				}, {
					icon: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/uni-ui/goodsnav/dianpu.png',
					text: '店铺'
				}, {
					icon: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/uni-ui/goodsnav/carts.png',
					text: '购物车',
					info: 2
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getSwiperData()
			this.getInfoData()
			this.getDescData()
		},
		methods: {
			async getSwiperData() {
				const {
					data: res
				} = await getSwiper(this.id)
				this.swiper = res.message
			},
			async getInfoData() {
				const {
					data: res
				} = await getInfo(this.id)
				this.info = res.message[0]
			},
			async getDescData() {
				const {
					data: res
				} = await getDesc(this.id)
				this.desc = res.message[0].content
				console.log(this.desc)
			},
			onClick(e) {
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
			},
			buttonClick(e) {
				console.log(e)
				this.options[2].info++
			}
		},
		components: {
			uniGoodsNav
		}
	}
</script>

<style lang="scss">
	.goods-detail {

		width: 100%;
		font-size: 32rpx;

		swiper {
			width: 100%;
			height: 600rpx;
			text-align: center;
			margin-bottom: 30rpx;
		}

		.price {
			padding: 0 20rpx;
			margin: 16rpx 0;
			color: $shop-color;

			text:nth-child(2) {
				color: #ddd;
				text-decoration: line-through;
				margin-left: 20rpx;
			}
		}

		.title {
			padding: 0 20rpx;
			line-height: 60rpx;
		}

		.category {
			padding: 30rpx 20rpx;
			line-height: 50rpx;
			border: 10rpx solid #eee;
			border-left: none;
			border-right: none;
		}

		.detail {
			padding: 0 20rpx;

			.detail-title {
				padding: 20rpx 0;
				border-bottom: 1px solid #eee;
			}

			.content {
				padding: 20rpx 0;
			}
		}
		.goods-tabBar{
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
	
</style>
