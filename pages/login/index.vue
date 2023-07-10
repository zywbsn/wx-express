<template>
	<view>
		<view class="login">
			<form @submit="formSubmit">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="data.avatarImgUrl" mode="widthFix"></image>
				</button>
				<input type="nickname" name="input" class="weui-input" placeholder="请输入昵称" />
				<button form-type="submit" type="primary" style="width: 500rpx;margin: 0 auto;">完成</button>
			</form>
		</view>
	</view>
</template>

<script setup>
	import {
		getCurrentInstance,
		reactive
	} from "vue"

	import {
		onLoad
	} from "@dcloudio/uni-app";

	const {
		requests
	} = getCurrentInstance().appContext.config.globalProperties;

	const data = reactive({
		avatarImgUrl: '',
		name: '',
		code: ''
	})

	const formSubmit = (args) => {
		console.log(args);
		const info = {
			avatar_url: data.avatarImgUrl,
			name: args.detail.value.input
		};
		data.name = args.detail.value.input;
		login(info)
	};

	const onChooseAvatar = (args) => {
		const {
			avatarUrl
		} = args.detail
		data.avatarImgUrl = avatarUrl;
	};

	const login = (info) => {
		if (data.avatarImgUrl == "" || data.name == "") {
			uni.showToast({
				icon:"none",
				title:"请获取头像和昵称"
			})
			return;
		}
			const query = {
				code: data.code,
				...info
			};
		requests("/user/login", query, "POST").then((response) => {
			console.log("response", response);
			uni.setStorageSync('identity',response.info.identity)
			var pages = getCurrentPages(); //当前页
			var beforePage = pages[pages.length - 2]; //上个页面

			let url;
			if (pages.length == 1) {
				url = '/pages/index/index';
			} else {
				url = beforePage.$page.fullPath;
			}
			console.log(url)
			uni.reLaunch({
				url,
			})
		});
	};

	onLoad(() => {
		wx.login({
			success: (res) => {
				data.code = res.code;
				console.log("code", data.code);
			},
			fail: (err) => {
				console.log("err", err);
			}
		});
	});
</script>

<style lang="scss">
	.login {
		width: 100%;
		margin: 300rpx auto 0;
		text-align: center;

		.weui-input {
			margin: 50rpx auto;
		}

		.avatar-wrapper {
			width: 320rpx;
			height: 320rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.avatar {
				width: 300rpx;
				height: 300rpx;
				border-radius: 50%;
			}
		}
	}
</style>