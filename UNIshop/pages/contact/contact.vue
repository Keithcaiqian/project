<template>
	<view class="contact">
		<view class="img">
			<image src="../../static/logo.png" mode=""></image>
		</view>
		<view class="phone">
			联系电话：12425355（点击拨打）
		</view>
		<view class="address">
			联系地址：召唤师峡谷
		</view>
		<map :latitude="latitude" :longitude="longitude" :scale="scale"></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude:39.520212,
				longitude:118.687833,
				scale:10
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.phone,.address{
		font-size: 32rpx;
		line-height: 60rpx;
		height: 60rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #eee;
	}
	.contact{
		image{
			width: 100%;
		}
		map{
			width: 100%;
			height: 750rpx;
		}
	}
</style>
