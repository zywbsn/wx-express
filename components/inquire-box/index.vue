<template>
	<view style="width: 300rpx;padding:10rpx 0;box-sizing:border-box;border-radius: 20rpx;background-color: #fff;">
		<view class="top">
			<view @click="close" style="margin-left: auto;margin-right: 20rpx;">X</view>
		</view>
		<view class="center">
			{{props.text}}
		</view>
		<view class="bottom">
			<view @click="confirm" class="btn" style="margin-left: auto;background-color: #1aad19;">确认</view>
			<view @click="close" class="btn" style="margin: 0 20rpx; background-color: #e64340;">取消</view>
		</view>
	</view>
</template>

<script setup>
	import {getCurrentInstance} from "vue";
	
	const {
		requests,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;
	
	const props = defineProps({
		orderId: {
			type: Number,
			default: null,
		},
		text: {
			type: String,
			default: "是否确认操作"
		}
	});

	const emit = defineEmits(["close","order"])

	//确认接单
	const confirm = () => {
		let query = {
			id: props.orderId,
			receiver_id:uni.getStorageSync('identity')
		};
		requests("/express/order", query, "PUT").then((response) => {
			emit("order", response.data.info);
		});
		
	};

	//关闭弹框
	const close = () => {
		emit("close");
	};
</script>

<style lang="scss">
	.bottom {
		width: 100%;
		display: flex;

		.btn {
			font-size: 20rpx;
			padding: 10rpx;
			color: #fff;
			box-sizing: border-box;
			border-radius: 10rpx;
		}
	}

	.center {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}

	.top {
		width: 100%;
		display: flex;
	}
</style>