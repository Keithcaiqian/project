<template>
	<view class="community">
		<scroll-view class="left" scroll-y="true" >
			<view 
			@click="changeCurIndex(index,item.id)"
			:class="index==curIndex?'active':''" 
			v-for="(item,index) in message">
				{{item.title}}
			</view>
		</scroll-view>
		<scroll-view class="right" scroll-y="true" >
			<view v-if="selMessage.length===0">
				暂无数据
			</view>
			<view class="item" v-for="item in selMessage" :key='item.id'>
				<image @click="picPreview(item.img_url)" :src="item.img_url" mode=""></image>
				<view class="detail">
					{{item.title}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {getCommunityImg,getCommunityRight} from '../../service/community.js'
	export default {
		data() {
			return {
				message:[],
				curIndex:0,
				selMessage:[]
			}
		},
		onLoad(){
			this.getImg()
		},
		methods: {
			async getImg(){
				const {data:res} = await getCommunityImg()
				this.message = res.message
				console.log(res)
			},
			async changeCurIndex(index,id){
				this.curIndex = index
				const {data:res} = await getCommunityRight(id)
				this.selMessage = res.message
				console.log(res)
			},
			picPreview(src){
				const urls = this.selMessage.map(item=>{
					return item.img_url
				})
				uni.previewImage({
					current:src,
					urls
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.community{
		display: flex;
		height: 100%;
		.left{
			border-right: 1px solid #eee;
			height: 100%;
			width: 200rpx;
			view{
				border-top: 1px solid #eee;
				width: 100%;
				height: 150rpx;
				line-height: 150rpx;
				text-align: center;
			}
			.active{
				background-color: $shop-color;
				color: #fff;
			}
		}
		.right{
			flex: 1;
			.item{
				width: 95%;
				margin: 10rpx auto;
				image{
					border-radius: 5px;
					display: block;
					width: 100%;
				}
				.detail{
					margin-top: 10rpx;
					font-size: 30rpx;
				}
			}
		}
	}
</style>
