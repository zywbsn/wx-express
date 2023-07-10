<template>
	<view style="width: 100%;height: auto;margin: 20rpx auto;">
		<view class="list-box">
			<view class="list-item flex-center">
				<text class="item-title">头像：</text>
				<!-- <image class="head-img" src="../../static/image/index/top-img-8.png" mode=""></image> -->
				<view class="head-img">
					<!-- <uni-file-picker @select="select" @progress="progress" @success="success" @fail="fail" limit="1"
						:del-icon="false" disable-preview :imageStyles="{
						width: 64,
						height: 64,
						border: {
							radius: '50%'
						}}" file-mediatype="image" v-model="data.info.avatar_url"> -->
					<image class="head-img" :src="data.info.avatar_url_img" mode="" @click="uploadHeadImage"></image>
					<!-- </uni-file-picker> -->
				</view>
				<view class="right-icon"></view>
			</view>

			<view class="line"></view>

			<view class="list-item flex-center">
				<text class="item-title">昵称：</text>
				<input :disabled="!data.isEdit" v-model="data.info.name" type="text" placeholder="请输入昵称">
			</view>
			<view class="line"></view>

			<view class="list-item flex-center">
				<text class="item-title">用户账户：</text>
				<input :disabled="!data.isEdit" v-model="data.info.user_name" type="text"
					:placeholder="!data.isEdit ? '暂未设置' : '请输入用户账户'">
			</view>
			<view class="line"></view>
			
			<view class="list-item flex-center">
				<text class="item-title">密码：</text>
				<input :disabled="!data.isEdit" v-model="data.info.password" type="text"
					:placeholder="!data.isEdit ? '暂未设置' : '请输入用户账户'">
			</view>
			<view class="line"></view>

			<!-- <view class="list-item flex-center">
				<text class="item-title">生日：</text>
				<uni-datetime-picker type="datetime" v-model="data.birthday">
					{{data.birthday ? data.birthday : '请选择生日'}}
				</uni-datetime-picker>
				<view class="right-icon"></view>
			</view> -->
			<!-- <view class="line"></view> -->

			<!-- <view class="list-item flex-center">
				<text class="item-title">性别：</text>
				<uni-data-checkbox selectedColor="#F5AE16" v-model="data.sex" :localdata="sex"></uni-data-checkbox>
			</view>
			<view class="line"></view> -->

			<!-- <view class="list-item flex-center">
				<text class="item-title">昵称：</text>
				<input v-model="data.realName" placeholder="请输入真实姓名" type="text">
			</view>
			<view class="line"></view> -->

			<view class="list-item flex-center">
				<text class="item-title">邮箱：</text>
				<input :disabled="!data.isEdit" v-model="data.info.mail" :placeholder="!data.isEdit ? '暂未设置' : '请输入邮箱'"
					type="text">
			</view>
			<view class="line"></view>

			<view class="list-item flex-center">
				<text class="item-title">手机号：</text>
				<input :disabled="!data.isEdit" v-model.number="data.info.phone" :placeholder="!data.isEdit ? '暂未设置' : '请输入手机号'"
					type="text">
			</view>
		</view>
		<view @click="submit" class="sub">{{data.isEdit ? "提交修改" : "编辑"}}</view>
	</view>
</template>


<script setup>
	import {
		reactive,
		getCurrentInstance
	} from "vue";

	import {
		onLoad
	} from "@dcloudio/uni-app";

	const {
		requests,
		upload,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;

	// 获取上传状态
	const uploadHeadImage = () => {
		let url = baseUrl + "/upload";
		uni.chooseImage({
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				uni.uploadFile({
					url, //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'file',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (uploadFileRes) => {
						const result = JSON.parse(uploadFileRes.data);
						data.info.avatar_url = result.data.path;
						submitAvatarUrl();
					}
				});
			}
		});

	};

	// 输入信息
	const data = reactive({
		info: {},
		isEdit: false
	});

	//修改头像
	const submitAvatarUrl = () => {
			const {
				avatar_url,
				identity
			} = data.info;
			const query = {
				avatar_url,
				identity
			};
			requests("/user/info", query, "PUT").then((response) => {
				uni.showToast({
					icon:"none",
					title:"修改头像成功"
				});
			}).finally(() => {
				getInfo(data.info.identity);
			});
	};

	// 获取提交修改
	const submit = () => {
		if (data.isEdit) {
			const {
				avatar_url,
				name,
				user_name,
				password,
				mail,
				phone,
				identity
			} = data.info;
			const query = {
				avatar_url,
				name,
				user_name,
				password,
				mail,
				phone,
				identity
			};
			requests("/user/info", query, "PUT").then((response) => {
				uni.showToast({
					icon:"none",
					title:"修改成功"
				});
			}).finally(() => {
				getInfo(data.info.identity);
			});
		}
		data.isEdit = !data.isEdit;
	};

	//获取用户信息
	const getInfo = (identity) => {
		requests("/user/info", {
			identity
		}, "GET").then((response) => {
			data.info = response.info;
			data.info.avatar_url_img = baseUrl + data.info.avatar_url;
		});
	};

	onLoad(() => {
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
	.flex-center {
		display: flex;
		align-items: center;
	}

	.right-icon {
		width: 10rpx;
		height: 10rpx;
		border-right: 1rpx solid #999999;
		border-bottom: 1rpx solid #999999;
		transform: rotate(-45deg);
	}

	.input {
		width: 178rpx;
		height: 36rpx;
		font-size: 25rpx;
		font-family: PingFang-SC-Regular;
		line-height: 44rpx;
		opacity: 1;
	}

	.sub {
		width: 570rpx;
		height: 77rpx;
		background: rgba(245, 174, 22);
		opacity: 1;
		border-radius: 18rpx;
		font-size: 27rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 77rpx;
		text-align: center;
		color: #FFFFFF;
		opacity: 1;
		margin-left: 90rpx;
		margin-right: 90rpx;
		margin-top: 40rpx;
	}

	.line {
		width: 642rpx;
		height: 1rpx;
		background: rgba(195, 195, 195, 0.39);
		opacity: 1;
		margin-bottom: 20rpx;
		margin-left: 28rpx;
		margin-right: 28rpx;
	}

	.list-box {
		width: 700rpx;
		height: auto;
		background: rgba(255, 255, 255);
		box-shadow: 0rpx 2rpx 11rpx rgba(26, 33, 41, 0.06);
		opacity: 1;
		margin: 20rpx 25rpx 0;
		border-radius: 10rpx;
		position: relative;

		.list-item {
			padding: 25rpx 30rpx;
			box-sizing: border-box;

			.get-code {
				width: 159rpx;
				height: 43rpx;
				background: rgba(245, 174, 22, 0.39);
				opacity: 0.1;
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 43rpx;
				text-align: center;
				color: #F5AE16;
				opacity: 1;
				border-radius: 50rpx;
			}


			.item-title {
				width: 140rpx;
				height: 36rpx;
				font-size: 25rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 27rpx;
				color: #2E2E2E;
				opacity: 1;
			}

			.head-img {
				width: 108rpx;
				height: 108rpx;
				border-radius: 50rpx;
				margin-left: auto;
				margin-right: 20rpx;
			}
		}


	}
</style>