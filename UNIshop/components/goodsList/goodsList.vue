<template>
	<view class="goods-list">
		<view class="goods-item" @click="handleClick(item.id)" v-for="item in goods" :key='item.id'>
			<image :src="item.img_url" mode=""></image>
			<view class="price">
				<text>￥{{item.sell_price}}</text>
				<text>￥{{item.market_price}}</text>
			</view>
			<view class="detail">
				{{item.title}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['goods'],
		methods:{
			handleClick(id){
				this.$emit('toGoodsDetail',id)
			}
		}
	}
</script>

<style lang="scss">
	.goods-list{
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width:100%;
		padding:10rpx;
		.goods-item{
			width: 360rpx;
			padding: 15rpx;
			box-sizing: border-box;
			background-color: #fff;
			margin-bottom: 10rpx;
			image{
				width: 60%;
				height: 250rpx;
				display: block;
				margin: 30rpx auto;
			}
			.price{
				margin: 5rpx 0;
				color: $shop-color;
				font-size: 30rpx;
				text:nth-child(2){
					color: #ccc;
					font-size: 28rpx;
					margin-left: 8rpx;
					text-decoration: line-through;
				}
			}
			.detail{
				font-size: 28rpx;
				line-height: 50rpx;
			}
		}
	}
</style>
