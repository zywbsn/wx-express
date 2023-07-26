<template>
	<view class="main">
		<view class="message">
			<view class="info">
				<image class="head-img" :src="baseUrl + info.avatar_url" mode="widthFix"></image>
				<view class="info-message">
					<view>{{info.name}}</view>
					<view style="margin-top: 10rpx;font-size: 28rpx;color: #ccc;">快递代取系统</view>
				</view>
				<view @click="handleEdit" class="edit-btn">
					编辑
				</view>
			</view>
		</view>

		<view class="message" style="margin-top: 20rpx;">
			<view class="message-info">
				我的订单<text>{{info.submit_num}}</text>
			</view>
			<view class="line"></view>
			<view class="message-info">
				我的接单<text>{{info.submit_num}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		getCurrentInstance,
		ref
	} from "vue";

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	const {
		requests,
		upload,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;

	const info = ref({});
	
	//跳转编辑
	const handleEdit = () => {
		uni.navigateTo({
			url:"/pages/edit_mine/index"
		});
	};


	//获取用户信息
	const getInfo = (identity) => {
		requests("/user/info", {
			identity
		}, "GET").then((response) => {
			info.value = response.info;
		});
	};

	onShow(() => {
		// uni.setStorageSync('userChoose', type)
		const identity = uni.getStorageSync('identity'); //获取用户唯一标识
		if (identity) {
			getInfo(identity)
		} else {
			uni.navigateTo({
				url: "/pages/login/index"
			})
		}
	});
</script>

<style lang="scss">
	.line {
		width: 98%;
		height: 1rpx;
		margin: 20rpx auto;
		background-color: #f4f4f4;
	}
	
	.message {
		width: 94%;
		margin: 0 auto;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;

		.message-info {
			width: 100%;
			font-size: 36rpx;
			font-weight: bold;
			display: flex;

			text {
				margin-left: auto;
				margin-right: 20rpx;
				font-weight: normal;
			}
		}

		.info {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			
			.edit-btn {
				width: 80rpx;
				text-align: center;
				padding: 10rpx;
				margin-left: auto;
				background-color: #f4bf53;
				color: #fff;
				border-radius: 10rpx;
				font-size: 26rpx;
			}

			.info-message {
				margin-left: 20rpx;
				width: calc(100% - 220rpx);
				
				view {
					width: 100%;
				}
			}

			.head-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
	}

	.main {
		width: 100%;
		min-height: 100vh;
		margin: 0 auto;
		padding-bottom: 1rpx;
		background-color: #f4f4f4;
	}
</style>