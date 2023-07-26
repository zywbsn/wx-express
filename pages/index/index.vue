<template>
	<view class="main">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="1500">
				<swiper-item>
					<view class="swiper-item uni-bg-red" style="background-color: red;">A</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green" style="background-color: green;">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue" style="background-color: blue;">C</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="nav">
			<view v-for="item in data.navList" :key="item.id" @click="allOrder(item.id)"
				:style="data.orderStatus == item.id ? 'background-color: skyblue;color:#fff;' : ''" class="nav-item">
				{{item.label}}
			</view>
		</view>

		<view class="list" v-for="item in data.list" :key="item.ID">
			<view class="list-item" @click="handleDetail(item.ID)">
				<view class="item-top">
					<view class="item-type">快递代取</view>
					<view class="item-code">{{item.code}}</view>
				</view>
				<view class="item-good">
					<!-- <view> -->
					<image class="item-img" :src="baseUrl + item.create_img" mode=""></image>
					<!-- </view> -->
					<view class="item-message">
						<view>下单人姓名:{{item.create_by}}</view>
						<view>取件时间:{{item.receive_date}}</view>
						<view>取件码:{{item.receive_code}}</view>
						<view>收件地址:{{item.address}}</view>
					</view>
					<view class="item-price">
						￥<text>{{item.price}}</text>
					</view>
				</view>
			</view>
			<view v-if="item.status == 0" class="btn">
				<button @click="orderTaking(item.ID)" type="primary" size="mini">接单</button>
				<button @click="notInterested(item.ID)" style="margin-left: auto;" type="warn" size="mini">不感兴趣</button>
			</view>
			<view v-else class="received">
				该订单已由 {{item.receiver}} 接单
			</view>
		</view>

		<uni-popup ref="takingPopup">
			<inquire-box :orderId="data.orderId" :text="'是否确认接单'" @order="order" @close="close"></inquire-box>
		</uni-popup>

		<uni-fab ref="fab" @fabClick="addOrder" :pattern="{buttonColor :'#f4bf53'}" horizontal="right" />

	</view>
</template>

<script setup>
	import inquireBox from "../../components/inquire-box/index.vue";
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";

	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";

	const {
		requests,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;

	const data = reactive({
		orderId: null, //接单 id
		orderStatus: 1, //订单状态
		//订单列表
		list: [{
			id: 1,
			create_by: "silenceLamb",
			code: "1234243242342323",
			address: "一号楼",
			created_date: "3333-66-65",
			receive_date: "3333-66-65",
			price: "9.00",
			receive_code: "32-32-32"
		}],
		//订单请求分页
		listQuery: {
			page: 1,
			size: 10
		},
		navList: [{
				id: 1,
				label: "全部"
			},
			{
				id: 2,
				label: "可接单"
			},
			{
				id: 3,
				label: "我的发布"
			},
			{
				id: 4,
				label: "我的接单"
			},
		]
	});

	const takingPopup = ref(null); //接单弹框

	const isNoData = ref(false);

	//新增订单
	const addOrder = () => {
		uni.navigateTo({
			url: "/pages/add_order/index"
		})
	};

	//接单
	const order = (arg) => {
		data.list.map((item) => {
			if (item.ID == data.orderId) {
				item.status = 1;
				item.receiver = arg.name;
			}
		});
		close();
	};

	//关闭接单询问框
	const close = () => {
		takingPopup.value.close();
	};

	//详情
	const handleDetail = (id) => {
		console.log("详情 handleDetail", id);
		uni.navigateTo({
			url: "/pages/order_detail/index?id=" + id
		});
	};

	//不感兴趣
	const notInterested = (id) => {
		let list = [];
		data.list.map((item) => {
			if (item.ID != id) list.push(item);
		});
		data.list = list;
	};

	//接单
	const orderTaking = (id) => {
		takingPopup.value.open();
		data.orderId = id;
		console.log("接单 orderTaking", id);
	};

	//接单状态 
	const allOrder = (type) => {
		if (data.orderStatus == type) return;
		data.orderStatus = type;
		data.listQuery = {
			size: 10,
			page: 1
		};
		if (type == 1) {
			data.listQuery.status = -1;
		} else if (type == 2) {
			data.listQuery.status = 0;
		} else if (type == 3) {
			data.listQuery.receiver_id = uni.getStorageSync("identity");
		} else if (type == 4) {
			data.listQuery.create_id = uni.getStorageSync("identity");
		}
		
		getList(data.listQuery);
	};

	// 获取订单列表 
	const getList = (query, method) => {
		requests("/express/list", query, "GET").then((response) => {
			if (response.data.list.length < 10) {
				isNoData.value = true;
			}
			if (data.listQuery.page == 1) {
				data.list = response.data.list;
			} else {
				data.list = [...data.list, ...response.data.list];
			}
			if (method) uni.stopPullDownRefresh();
		});
	};

	//下拉事件
	onPullDownRefresh(() => {
		data.listQuery.page = 1;
		getList(data.listQuery, true);
	});

	//上滑事件
	onReachBottom(() => {
		if (isNoData.value) return;
		data.listQuery.page++;
		getList(data.listQuery);
	});

	onLoad(() => {
		getList(data.listQuery);
	})
</script>

<style lang="scss">
	.list {
		width: 96%;
		height: auto;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
		background-color: #fff;

		.received {
			margin: 0 auto;
			display: flex;
			padding: 20rpx 0;
			box-sizing: border-box;
			align-items: center;
			justify-content: center;
		}

		.btn {
			margin: 0 auto;
			display: flex;
			padding: 20rpx 0;
			box-sizing: border-box;

			button {
				width: 48%;
				margin: 0;
			}
		}

		.list-item {
			margin: 0 auto;
			box-sizing: border-box;

			.item-good {
				display: flex;
				align-items: center;
				margin: 20rpx 0 0;

				.item-price {
					color: #ff0000;
					font-weight: bold;
					margin-left: auto;
					margin-top: auto;

					text {
						font-size: 40rpx
					}
				}

				.item-message {
					margin-left: 20rpx;
					color: #989898;
					font-size: 24rpx;
				}

				.item-img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
				}
			}

			.item-top {
				display: flex;

				.item-code {
					margin-left: auto;
					font-size: 24rpx;
				}

				.item-type {
					width: 100rpx;
					height: 30rpx;
					text-align: center;
					line-height: 30rpx;
					color: #ff8420;
					border: 1px solid #ff8420;
					border-radius: 5rpx;
					font-size: 20rpx;
				}
			}
		}
	}

	.nav {
		height: 150rpx;
		width: 96%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		background-color: #fff;

		.nav-item {
			width: 100rpx;
			height: 100rpx;
			text-align: center;
			line-height: 100rpx;
			font-size: 20rpx;
			margin: 0 auto;
			background-color: pink;
			border-radius: 50%;
		}
	}

	.main {
		width: 100%;
		min-height: 100vh;
		margin: 0 auto;
		padding-bottom: 1rpx;
		background-color: #f4f4f4;
	}

	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}
</style>