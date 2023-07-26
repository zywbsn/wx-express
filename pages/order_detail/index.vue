<template>
	<view class="main">
		<view class="message-box">
			<view>
				<text>发布者：</text>{{info.create_by}}
			</view>
			<view class="line"></view>
			<view>
				<text>发布时间：</text>{{getDate(info.CreatedAt)}}
			</view>
			<view class="line"></view>
			<view>
				<text>快递单号：</text>{{info.code}}
			</view>
			<view class="line"></view>
			<view>
				<text>取件码：</text>{{info.receive_code}}
			</view>
			<view class="line"></view>
			<view>
				<text>订单状态：</text>{{getOrderStatus(info.order_status)}}
			</view>
			<view class="line"></view>
			<view>
				<text>收货日期：</text>{{info.receive_date}}
			</view>
			<view class="line"></view>
			<view>
				<text>订单费用：</text>{{info.price}}
			</view>
			<view class="line"></view>
			<view>
				<text>发布者手机号：</text>{{info.create_phone}}
			</view>
			<view class="line"></view>
			<view style="margin-bottom: 0;">
				<text>接单人：</text>{{info.receiver}}
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";

	import {
		onLoad
	} from "@dcloudio/uni-app";

	const orderId = ref(null);
	const info = ref({});

	const {
		getDate,
		requests,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;

	//获取订单详情
	const getInfo = (id) => {
		requests("/express/info", {
			id
		}, "GET").then((response) => {
			info.value = response.data;
		});
	};

	//订单状态
	const getOrderStatus = (status) => {
		// 订单状态 0 - 未接单  1 - 已完成  2 - 已接单  3 - 已收货
		const orderStatusList = [{
				value: 0,
				label: "未接单"
			},
			{
				value: 1,
				label: "已完成"
			},
			{
				value: 2,
				label: "已接单"
			},
			{
				value: 3,
				label: "已收货"
			}
		];
		let label;
		orderStatusList.map((item) => {
			if (item.value == status) label = item.label;
		});
		return label;
	};

	onLoad((options) => {
		orderId.value = options.id;
		getInfo(options.id);
	});
</script>

<style lang="scss">
	.line {
		width: 98%;
		height: 1rpx;
		margin: 20rpx auto;
		background-color: #f4f4f4;
	}

	.main {
		width: 100%;
		min-height: 100vh;
		margin: 0 auto;
		padding-bottom: 1rpx;
		background-color: #f4f4f4;
		padding-top: 30rpx;

		.message-box {
			width: 94%;
			margin: 0 auto;
			background-color: #fff;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 10rpx;

			view {
				font-size: 36rpx;

				text {
					font-weight: bold;
				}
			}
		}
	}
</style>