<template>
	<view class="main">
		<view class="info-list">
			<view class="info">
				<text class="item-title">快递单号：</text>
				<input v-model="info.code" type="text" placeholder="请输入快递单号">
			</view>
			<view class="line"></view>
			<view class="info">
				<text class="item-title">收货地址：</text>
				<input v-model="info.address" type="text" placeholder="请输入收货地址">
			</view>
			<view class="line"></view>
			<view class="info">
				<text class="item-title">订单费用：</text>
				<input v-model="info.price" type="text" placeholder="请输入订单费用">
			</view>
			<view class="line"></view>
			<view class="info">
				<text class="item-title">取件码：</text>
				<input v-model="info.receive_code" type="text" placeholder="请输入取件码">
			</view>
			<view class="line"></view>
			<view class="info">
				<text class="item-title">联系电话：</text>
				<input v-model="info.create_phone" type="text" placeholder="请输入联系电话">
			</view>

			<view style="width: 100%; display: flex;margin-top: 40rpx;">
				<button class="btn" @click="save" type="primary" size="mini">保 存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from "vue";

	const {
		requests,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;

	//订单信息
	const info = ref({
		create_id:uni.getStorageSync('identity')
	});

	//保存
	const save = () => {
		console.log(info.value);
		requests("/express/create", info.value, "POST").then((response) => {
			console.log("response", response);
		});
	};
</script>

<style lang="scss">
	.line {
		width: 98%;
		height: 1rpx;
		margin: 20rpx auto;
		background-color: #f4f4f4;
	}

	.btn {
		width: 50%;
		height: auto;
		margin: 0 auto;
	}

	.info-list {
		width: 96%;
		height: auto;
		margin: 0 auto;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		box-sizing: border-box;

		.info {
			margin-bottom: 20rpx;
			box-sizing: border-box;
			display: flex;
			
			.item-title {
				width: 200rpx;
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